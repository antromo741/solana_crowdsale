import { type Connection, Keypair, type Signer, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js'
import { createMint, mintTo } from '@solana/spl-token'

/*
  Check out SPL token docs:
  https://spl.solana.com/token#example-creating-your-own-fungible-token
*/

export async function createMintAccount({
  connection,
  creator,
  decimals = 9
}: {
  connection: Connection,
  creator: Signer,
  decimals?: number
}) {
  const mintKeypair = Keypair.generate();

  const mint = await createMint(
    connection, // Connection to the blockchain
    creator.payer, // Who is paying for the transaction
    creator.payer.publicKey, // Who is allowed to mint
    creator.payer.publicKey, // Who is allowed to freeze
    decimals, // Token decimals, usually 9 
    mintKeypair // Initialize mint account to this keypair
  )

  const mintId = mint.toBase58()

  // Could also do mintKeypair.publicKey
  console.log(`Created Mint Account: ${mintId}\n`)

  return mintKeypair
}

export async function mintTokens({
  connection,
  creator,
  mintKeypair,
  tokenAccount,
  amount
}: {
  connection: Connection,
  creator: Signer,
  mintKeypair: Keypair,
  tokenAccount: Keypair,
  amount: number
}) {
  const mintAuthority = creator // Who is allowed to mint

  await mintTo(
    connection,
    creator.payer,
    mintKeypair.publicKey,
    tokenAccount,
    mintAuthority,
    amount
  )

  console.log(`Minted ${amount / 10 ** 9} Tokens to ${tokenAccount}\n`)
}

export async function transferLamports({
  connection,
  from,
  to,
  amount
}: {
  connection: Connection,
  from: Signer,
  to: Keypair,
  amount: number
}) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.payer.publicKey,
      toPubkey: to.publicKey,
      lamports: amount,
    })
  );

  await sendAndConfirmTransaction(
    connection,
    transaction,
    [from.payer]
  );

  console.log(`Sent ${amount / 10 ** 9} SOL to ${to.publicKey}\n`)
}