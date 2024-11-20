use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Member {
    #[max_len(32)]
    pub name: String,
    #[max_len(32)]
    pub github_handle: String,
    pub project: Pubkey,
    pub member_pubkey: Pubkey,
    pub score: i64,
    pub is_active: bool,
    pub bump: u8,
}
