import * as anchor from "@coral-xyz/anchor"
import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { expect } from 'chai'
import { Crowdsale } from "../target/types/crowdsale"

import { transferLamports, createMintAccount, mintTokens } from "./_helpers"

describe("Crowdsale", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  const connection = provider.connection
  anchor.setProvider(provider)

  // Our overall program
  const program = anchor.workspace.Crowdsale as anchor.Program<Crowdsale>

  // Our main account. This is who will create 
  // the token mint, crowdsale, and fund the buyer account with SOL
  const creator = (program.provider as anchor.AnchorProvider).wallet

  /* --- GENERATE KEYPAIRS --- */
  // Create Crowdsale keypair
  const crowdsaleKeypair = anchor.web3.Keypair.generate()

  // Create the buyer keypair
  const buyerKeypair = anchor.web3.Keypair.generate()

  // Console log our keys
  console.log(`Creator Public Key: ${creator.publicKey}`)
  console.log(`Crowdsale Public Key: ${crowdsaleKeypair.publicKey}`)
  console.log(`Buyer Public Key: ${buyerKeypair.publicKey}\n`)

  /* --- SETUP CROWDSALE PARAMS --- */
  // We'll use the crowdsale keypair public key as the ID, and set
  // the cost of buying a token
  const ID = crowdsaleKeypair.publicKey
  const COST = 1

  /* --- SETUP CROWDSALE AUTHORITY --- */
  // In order to transfer tokens, we need to create
  // the authority for the crowdsale. This will be based
  // off of the ID of the crowdsale
  const crowdsalePDA = PublicKey.findProgramAddressSync(
    [ID.toBuffer()],
    anchor.workspace.Crowdsale.programId
  )[0]

  const crowdsaleAuthorityPDA = PublicKey.findProgramAddressSync(
    [ID.toBuffer(), 'authority'],
    anchor.workspace.Crowdsale.programId,
  )[0]

  console.log(`Crowdsale Key: ${crowdsalePDA}`)
  console.log(`Crowdsale Authority: ${crowdsaleAuthorityPDA}`)

  let mintKeypair, crowdsaleTokenAccount

  before(async () => {
    // Create the token mint
    mintKeypair = await createMintAccount({
      connection,
      creator,
    })

    // Create the crowdsale
    await program.methods
      .initialize(ID, COST)
      .accounts({
        crowdsale: crowdsalePDA,
        mintAccount: mintKeypair.publicKey,
        crowdsaleAuthority: crowdsaleAuthorityPDA
      })
      .signers([creator.payer])
      .rpc()

    // Get the Crowdsale token account
    crowdsaleTokenAccount = getAssociatedTokenAddressSync(mintKeypair.publicKey, crowdsaleAuthorityPDA, true)
    console.log(`Crowdsale Token Account: ${crowdsaleTokenAccount}\n`)

    // Mint tokens to the Crowdsale
    await mintTokens({
      connection,
      creator,
      mintKeypair,
      tokenAccount: crowdsaleTokenAccount,
      amount: 100000000000 // 100 Tokens
    })

    // Fund the buyer account with SOL
    await transferLamports({
      connection,
      from: creator,
      to: buyerKeypair,
      amount: 5000000000, // 5 SOL
    })
  })

  describe('Deployment', () => {
    it('Creates the Crowdsale!', async () => {
      // Get the state of the crowdsale
      const crowdsaleState = await program.account.crowdsale.fetch(crowdsalePDA)

      // equal asserts the target is strictly equal to where as eql is not strict
      // Since the return values may not be the exact type we use eql (ex. "10" == 10)
      expect(crowdsaleState.id).to.eql(crowdsaleKeypair.publicKey)
      expect(crowdsaleState.cost).to.eql(COST)
      expect(crowdsaleState.status).to.eql({ open: {} })
    })

    it("Has tokens", async () => {
      // Ensure the crowdsale has 100 tokens
      const crowdsaleTokenBalance = await connection.getTokenAccountBalance(crowdsaleTokenAccount)
      expect(crowdsaleTokenBalance.value.amount).to.eql("100000000000")
    })
  })

  describe("Transferring Tokens", () => {
    // For simplicity, we'll request 1 token
    // Since the cost of 1 token is 1 SOL, we'll
    // need a minimum of 1 SOL in the account.
    // We also need to convert to 9 decimals.
    const AMOUNT = 1 * 10 ** 9

    before(async () => {
      await program.methods
        .buyTokens(AMOUNT)
        .accounts({
          buyer: buyerKeypair.publicKey,
          crowdsale: crowdsalePDA,
          crowdsaleAuthority: crowdsaleAuthorityPDA,
          mintAccount: mintKeypair.publicKey,
        })
        .signers([buyerKeypair])
        .rpc()
    })

    it("Updates crowdsale's token account balance", async () => {
      const crowdsaleTokenBalance = await connection.getTokenAccountBalance(crowdsaleTokenAccount)
      expect(crowdsaleTokenBalance.value.amount).to.eql("99000000000")
    })

    it("Updates crowdsale's SOL balance", async () => {
      const crowdsaleBalance = await connection.getBalance(crowdsalePDA)
      expect(crowdsaleBalance).to.be.gt(1000000000)
    })

    it("Updates buyer's token account balance", async () => {
      // Get buyer token address
      const buyerTokenAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, buyerKeypair.publicKey, true)

      // Get the Buyer token balance
      const buyerTokenBalance = await connection.getTokenAccountBalance(buyerTokenAddress)
      expect(buyerTokenBalance.value.amount).to.eql("1000000000")
    })

    it("Updates buyer's SOL balance", async () => {
      const buyerBalance = await connection.getBalance(buyerKeypair.publicKey)
      expect(buyerBalance).to.be.lt(4000000000)
    })
  })

  describe("Withdrawing SOL", () => {
    let creatorBalanceBefore = 0, crowdsaleBalanceBefore = 0

    before(async () => {
      creatorBalanceBefore = await connection.getBalance(creator.publicKey)
      crowdsaleBalanceBefore = await connection.getBalance(crowdsalePDA)

      await program.methods
        .withdraw()
        .accounts({
          crowdsale: crowdsalePDA,
        })
        .signers([creator.payer])
        .rpc()
    })

    it("Updates crowdsale's SOL balance", async () => {
      const crowdsaleBalance = await connection.getBalance(crowdsalePDA)
      expect(crowdsaleBalance).to.be.lt(crowdsaleBalanceBefore)
    })

    it("Updates creator's SOL balance", async () => {
      const creatorBalance = await connection.getBalance(creator.publicKey)
      expect(creatorBalance).to.be.gt(creatorBalanceBefore)
    })
  })
})