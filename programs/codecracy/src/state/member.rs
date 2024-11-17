use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Member {
    pub member: Pubkey,
    pub project: Pubkey,
    pub bump: u8,
}
