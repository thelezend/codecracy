use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Member {
    pub project: Pubkey,
    pub member_pubkey: Pubkey,
    pub is_active: bool,
    pub funds_claimed: bool,
    pub score: u64,
    pub bump: u8,
    #[max_len(32)]
    pub github_handle: String,
}
