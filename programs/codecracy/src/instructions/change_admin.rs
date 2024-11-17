use anchor_lang::prelude::*;

use crate::Project;

#[derive(Accounts)]
pub struct AdminChange<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: No check required for new admin
    pub new_admin: UncheckedAccount<'info>,

    #[account(
        mut,
        has_one = admin
    )]
    pub project_config: Account<'info, Project>,
}

impl<'info> AdminChange<'info> {
    pub fn change_admin(&mut self) -> Result<()> {
        self.project_config.admin = self.new_admin.key();
        Ok(())
    }
}
