use anchor_lang::prelude::*;

mod state;
mod constants;
mod instructions;

declare_id!("4tAj8UbxCCVChy785xKz4ZK17vKch3CAbwM8co7u8VUb");

#[program]
pub mod crowdsale {
    pub use super::instructions::*;
    use super::*;

    // Our constructor
    pub fn initialize(ctx: Context<CreateCrowdsale>, id: Pubkey, cost: u32) -> Result<()> {
        instructions::create_crowdsale(ctx, id, cost)
    }

    // Where a user will buy a token
    pub fn buy_tokens(ctx: Context<BuyTokens>, amount: u32) -> Result<()> {
        instructions::buy_tokens(ctx, amount)
    }


    // Where the owner can withdraw Sol
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        instructions::withdraw(ctx)
    }
}


