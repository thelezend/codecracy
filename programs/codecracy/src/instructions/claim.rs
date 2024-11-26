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

        let mut total_score: u64 = 0;
        for member in remaining_accounts.iter() {
            let member_data = Member::try_deserialize(&mut member.try_borrow_data()?.as_ref())?;
            total_score = total_score.checked_add(member_data.score).unwrap();
        }

        // Claim amount calculation needs to be optimized
        let claim_amount;

        if total_score == 0 {
            // Calculate claim_amount as claimable_funds / number of members
            claim_amount = self.project.claimable_funds as u128 / remaining_accounts.len() as u128;
        } else {
            // Calculate ratio as (member_score * PRECISION) / total_score
            const PRECISION: u64 = 10000;
            let ratio = (self.member.score as u128)
                .checked_mul(PRECISION as u128)
                .unwrap()
                .checked_div(total_score as u128)
                .unwrap();

            // Calculate claim_amount as (claimable_funds * ratio) / PRECISION
            claim_amount = (self.project.claimable_funds as u128)
                .checked_mul(ratio)
                .unwrap()
                .checked_div(PRECISION as u128)
                .unwrap();
        }

        require!(claim_amount > 0, ClaimError::InsufficientClaimAmount);

        let project_key = self.project.key();
        let seeds = &[
            &VAULT_SEED.as_bytes(),
            project_key.as_ref(),
            &[self.project.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let transfer_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };
        let transfer_ctx = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            transfer_accounts,
            signer_seeds,
        );
        transfer(transfer_ctx, claim_amount as u64)?;

        self.member.funds_claimed = true;

        Ok(())
    }
}
