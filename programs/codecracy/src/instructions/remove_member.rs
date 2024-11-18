use anchor_lang::prelude::*;

use crate::{Member, Project};

#[derive(Accounts)]
pub struct RemoveMember<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    pub member_pubkey: SystemAccount<'info>,

    #[account(
        has_one = admin
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [
            b"member",
            project.key().as_ref(),
            member_pubkey.key().as_ref()
            ],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,
}

impl<'info> RemoveMember<'info> {
    pub fn remove_member(&mut self) -> Result<()> {
        self.member.is_active = false;
        Ok(())
    }
}
