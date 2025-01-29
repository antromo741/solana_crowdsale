/*
  Even though we deploy the program via `anchor deploy`,
  we still need to initialize and create the actual crowdsale
  by interacting with the deployed program.
*/

// We include nocheck just to avoid 
// conflicts and simplify the script
// @ts-nocheck

import * as anchor from "@coral-xyz/anchor"
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

import IDL from "../target/idl/crowdsale.json"
import { Crowdsale } from "../target/types/crowdsale"

async function main() {
  // Setup wallet
  const creator = anchor.Wallet.local()

  // Setup provider
  const provider = new anchor.AnchorProvider(
    new Connection(clusterApiUrl("devnet")),
    creator,
    { preflightCommitment: "confirmed" }
  )

  anchor.setProvider(provider)

  // Create Crowdsale keypair
  const crowdsaleKeypair = anchor.web3.Keypair.generate()

  // Crowdsale state
  const ID = crowdsaleKeypair.publicKey
  const COST = 1

  const CROWDSALE_PROGRAM_ID = new PublicKey("4tAj8UbxCCVChy785xKz4ZK17vKch3CAbwM8co7u8VUb")
  const TOKEN_MINT_ACCOUNT = new PublicKey("FrgfkLuCVDupC4AwSRHc3CjobcEKWqUN6CEFu2nkzRm9")

  const program = anchor.workspace.Crowdsale as anchor.Program<Crowdsale>

  console.log(program)

  // Generate the Crowdsale PDA
  const crowdsalePDA = PublicKey.findProgramAddressSync(
    [ID.toBuffer()],
    CROWDSALE_PROGRAM_ID
  )[0]

  // Generate the Crowdsale authority PDA
  const crowdsaleAuthorityPDA = PublicKey.findProgramAddressSync(
    [ID.toBuffer(), Buffer.from('authority')],
    CROWDSALE_PROGRAM_ID,
  )[0]

  // Create the crowdsale
  await program.methods
    .initialize(ID, COST)
    .accounts({
      crowdsale: crowdsalePDA,
      mintAccount: TOKEN_MINT_ACCOUNT,
      crowdsaleAuthority: crowdsaleAuthorityPDA
    })
    .signers([creator.payer])
    .rpc()

  // Get the state
  const crowdsaleState = await program.account.crowdsale.fetch(crowdsalePDA)
  console.log(`Successfully Initialized Crowdsale at ${crowdsalePDA}\n`)
  console.log(`Crowdsale Authority: ${crowdsaleAuthorityPDA}\n`)
  console.log(`ID: ${crowdsaleState.id}`)
  console.log(`COST: ${crowdsaleState.cost}`)
  console.log(`TOKEN MINT: ${crowdsaleState.mintAccount}`)
  console.log(`TOKEN ACCOUNT: ${crowdsaleState.tokenAccount}`)
}

main()