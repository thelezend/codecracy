use anchor_lang::prelude::*;

use crate::Project;

#[derive(Accounts)]
pub struct CloseProject<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        has_one = admin
    )]
    pub project: Account<'info, Project>,
}

impl<'info> CloseProject<'info> {
    pub fn close_project(&mut self) -> Result<()> {
        self.project.is_active = false;
        Ok(())
    }
}
