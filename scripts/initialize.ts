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

  // Setup provider

  // Create Crowdsale keypair
 
  // Crowdsale state
 
  // Generate the Crowdsale PDA

  // Generate the Crowdsale authority PDA

  // Create the crowdsale

  // Get the state

}

main()