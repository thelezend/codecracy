use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub voter: Pubkey,
    pub project: Pubkey,
    pub poll: Pubkey,
    pub vote_type: VoteType,
    pub bump: u8,
}

#[derive(Copy, Clone, PartialEq, Eq, InitSpace, AnchorSerialize, AnchorDeserialize)]
pub enum VoteType {
    Low = 10,
    Medium = 20,
    High = 50,
    Reject = -20,
}
