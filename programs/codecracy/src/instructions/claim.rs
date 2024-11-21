use std::mem;

use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{error::ClaimError, Member, Project, MEMBER_SEED, VAULT_SEED};

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [
            MEMBER_SEED.as_bytes(),
            project.key().as_ref(),
            user.key().as_ref()
        ],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,

    #[account(
        mut,
        seeds = [
            VAULT_SEED.as_bytes(),
            project.key().as_ref()
        ],
        bump = project.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Claim<'info> {
    pub fn claim(&mut self, remaining_accounts: &[AccountInfo]) -> Result<()> {
        require!(!self.project.is_active, ClaimError::ProjectNotClosed);

        require!(!self.member.funds_claimed, ClaimError::FundsAlreadyClaimed);

        require!(self.member.score > 0, ClaimError::InsufficientScore);

        let mut total_score = 0;
        for member in remaining_accounts.iter() {
            let member_data = Member::try_deserialize(&mut member.try_borrow_data()?.as_ref())?;
            total_score += member_data.score;
        }

        let percentage = self.member.score as f64 / total_score as f64;
        let amount = (self.vault.lamports() as f64 * percentage) as u64;

        let transfer_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };
        let transfer_ctx =
            CpiContext::new(self.system_program.to_account_info(), transfer_accounts);
        transfer(transfer_ctx, amount)?;

        self.member.funds_claimed = true;
        Ok(())
    }
}
