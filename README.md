# Solana Crowdsale 

## Technology Stack & Tools
- Typescript (Unit testing)
- [Rust](https://www.rust-lang.org/tools/install) (Language for Solana programs)
- [Solana CLI (v1.18.22)](https://solana.com/docs/intro/installation) (Solana tools)
- [Anchor CLI (v0.30.1)](https://www.anchor-lang.com/) (Solana development framework)
- [Yarn (v4.4.1)](https://yarnpkg.com/getting-started/install) (Package manager)

## Further Resources
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana SPL Token Program](https://spl.solana.com/token)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Solana Token Examples](https://solana.com/docs/programs/examples#tokens)

## Prerequisites
### Rust
1. You'll want to have rust installed. You can execute:
`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`

You can also look here for installing:
[https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)

2. Add cargo to your PATH:
`. "$HOME/.cargo/env"`

3. Close and reopen your terminal

4. Verify Rust was installed:
`rustc --version`

### Solana CLI
1. Install Solana
`sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"`

2. Close and reopen your terminal

3. Verify Solana was installed:
`solana --version`

### Anchor CLI
1. Install AVM
`cargo install --git https://github.com/coral-xyz/anchor avm --force`

2. Verify AVM was installed
`avm --version`

3. Install Anchor CLI
`avm install 0.30.1`

4. Use Anchor CLI
`avm use 0.30.1`

5. Verify Anchor CLI version
`anchor --version`

### Yarn
1. Enable corepack 
`corepack enable`

## Compiling & Running Tests
1. Clone and enter the repository

2. Build the project
`anchor build`

3. Install Yarn Dependencies
`yarn install`

Note that you may need to manually set your yarn version by executing
`yarn set version 4.4.1`

4. Run the tests
`anchor test`