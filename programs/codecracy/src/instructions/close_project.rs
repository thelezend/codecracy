use anchor_lang::prelude::*;

use crate::{Project, VAULT_SEED};

#[derive(Accounts)]
pub struct CloseProject<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        has_one = admin
    )]
    pub project: Account<'info, Project>,

    #[account(
        seeds = [
            VAULT_SEED.as_bytes(),
            project.key().as_ref()
        ],
        bump,
    )]
    pub vault: SystemAccount<'info>,
}

impl<'info> CloseProject<'info> {
    pub fn close_project(&mut self) -> Result<()> {
        self.project.is_active = false;
        self.project.claimable_funds = self.vault.lamports();
        Ok(())
    }
}
