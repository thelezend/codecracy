use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub user: Pubkey,
    pub project: Pubkey,
    pub poll: Pubkey,
    pub vote_type: u32,
    pub bump: u8,
}
