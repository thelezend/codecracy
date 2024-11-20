use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub user: Pubkey,
    pub pull_request: u32,
    pub project: Pubkey,
    pub votes: u32,
    pub close_time: u64,
    pub rejections: u32,
    pub bump: u8,
}
