use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Member {
    #[max_len(32)]
    pub name: String,
    #[max_len(32)]
    pub github_handle: String,
    pub project: Pubkey,
    pub score: u64,
    pub bump: u8,
}
