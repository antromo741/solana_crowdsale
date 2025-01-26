use anchor_lang::prelude::*;

mod state;
mod constants;
mod instructions;

declare_id!("HciPz9qoNEBBWga6KWomnDovANbQWnTAT5iFSNW7Ji3K");

#[program]
pub mod crowdsale {
    pub use super::instructions::*;
    use super::*;

    // Our constructor
    pub fn initialize(ctx: Context<CreateCrowdsale>, id: Pubkey, cost: u32) -> Result<()> {
        instructions::create_crowdsale(ctx, id, cost)
    }

    // Where a user will buy a token

    // Where the owner can withdraw Sol
}


