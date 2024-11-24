use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub user: Pubkey,
    pub project: Pubkey,
    pub pull_request: u32,
    pub votes: u32,
    pub close_time: u64,
    pub rejections: u32,
    pub bump: u8,
}
