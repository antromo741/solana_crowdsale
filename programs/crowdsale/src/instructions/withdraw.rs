use anchor_lang::prelude::*;
use crate::state::Crowdsale;

pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
    // Get total balance
    let balance = ctx.accounts.crowdsale.get_lamports();

    // Get the minimum rent
    let rent = Rent::get()?.minimum_balance(Crowdsale::MAXIMUM_SIZE + 8);

    // Calculate current balance - rent
    let amount = balance - rent;
    
    // Update lamports
    ctx.accounts.crowdsale.sub_lamports(amount)?;
    ctx.accounts.owner.add_lamports(amount)?;
    Ok(())
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, constraint = &owner.key() == &crowdsale.owner)]
    pub owner: Signer<'info>,

    #[account(
        mut, 
        seeds = [
            crowdsale.id.as_ref(),
        ],
        bump,
    )]
    pub crowdsale: Account<'info, Crowdsale>,

    pub system_program: Program<'info, System>,
}