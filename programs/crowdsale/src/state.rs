use anchor_lang::prelude::*;

#[account]
pub struct Crowdsale {
    pub id: PubKey,

    pub cost: u32,

    pub mint_account: Pubkey,

    pub token_account: Pubkey,

    pub status: CrowdsaleStatus,

    pub owner: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, ParialEq, Eq)]
pub enum CrowdsaleStatus {
    Open, Closed,
}

impl Crowdsale {
    pub const MAXIMUM_SIZE: usize = 32 + 4 + 32 + 32 + 1 + 32;
}