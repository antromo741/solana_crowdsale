import * as anchor from "@coral-xyz/anchor"
import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { expect } from 'chai'
import { Crowdsale } from "../target/types/crowdsale"

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
});
