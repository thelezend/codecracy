use crate::{MAX_GITHUB_HANDLE_LENGTH, MAX_PROJECT_NAME_LENGTH};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Project {
    /// The public key of the project creator/admin
    pub admin: Pubkey,

    /// Is the project active
    pub is_active: bool,

    /// Lookup table for team members
    pub team_lut: Pubkey,

    // Claimable funds
    pub claimable_funds: u64,

    /// PDA bump seed for account derivation
    pub bump: u8,

    // PDA bump seed for vault account derivation
    pub vault_bump: u8,

    /// Project name, limited by MAX_PROJECT_NAME_LENGTH
    #[max_len(MAX_PROJECT_NAME_LENGTH)]
    pub project_name: String,

    // User's or organization's GitHub handle
    #[max_len(MAX_GITHUB_HANDLE_LENGTH)]
    pub github_handle: String,
}
