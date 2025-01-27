use anchor_lang::prelude::*;

#[account]
pub struct Crowdsale {
    // ID of crowdsale
    pub id: Pubkey,

    // Cost of token
    pub cost: u32,

    // Token mint account
    pub mint_account: Pubkey,

    // Crowdsale token account
    pub token_account: Pubkey,

    // Status of the crowdsale
    pub status: CrowdsaleStatus,

    // Owner of the crowdsale
    pub owner: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CrowdsaleStatus {
    Open,
    Closed,
}

impl Crowdsale {
    pub const MAXIMUM_SIZE: usize = 32 + 4 + 32 + 32 + 1 + 32;
}