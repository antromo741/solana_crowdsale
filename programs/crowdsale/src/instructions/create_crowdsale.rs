use {
    anchor_lang::prelude::*,
    anchor_spl::{
        associated_token::AssociatedToken,
        token::{Mint, Token, TokenAccount},
    },
};

use crate::{
    constants::AUTHORITY_SEED,
    state::{Crowdsale, CrowdsaleStatus},
};

/**
 * Create the crowdsale
 * @param id: This will be the ID of the crowdsale
 * @param cost: Cost of 1 token
 */
pub fn create_crowdsale(ctx: Context<CreateCrowdsale>, id: Pubkey, cost: u32) -> Result<()> {
    let crowdsale = &mut ctx.accounts.crowdsale;
    crowdsale.id = id;
    crowdsale.cost = cost;
    crowdsale.mint_account = ctx.accounts.mint_account.key();
    crowdsale.token_account = ctx.accounts.token_account.key();
    crowdsale.status = CrowdsaleStatus::Open;
    crowdsale.owner = ctx.accounts.creator.key();

    msg!("Crowdsale created!");

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreateCrowdsale<'info> {
    #[account(
        init, 
        payer = creator, 
        space = 8 + Crowdsale::MAXIMUM_SIZE,
        seeds = [
            id.as_ref(),
        ],
        bump,
    )]
    pub crowdsale: Account<'info, Crowdsale>,

    pub mint_account: Account<'info, Mint>,

    /// We create the token account for the crowdsale
    /// The creator pays for the token account creation
    /// This will be tied to the mint_account & crowdsale_authority
    #[account(
        init,
        payer = creator,
        associated_token::mint = mint_account,
        associated_token::authority = crowdsale_authority,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: Read only authority
    /// This will allow our crowdsale to transfer tokens
    #[account(
        seeds = [
            id.as_ref(),
            AUTHORITY_SEED
        ],
        bump,
    )]
    pub crowdsale_authority: AccountInfo<'info>,

    /// The account signing and paying
    #[account(mut)]
    pub creator: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}