use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
    pub vault: Pubkey,
    pub fee_basis_points: u16,
    pub bump: u8,
    pub vault_bump: u8,
}
