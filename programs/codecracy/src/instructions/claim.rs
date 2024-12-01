use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{error::ClaimError, Config, Member, Project, CONFIG_SEED, MEMBER_SEED, VAULT_SEED};

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

    #[account(
        seeds = [
            CONFIG_SEED.as_bytes(),
        ],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    #[account(
        mut,
        seeds = [
            VAULT_SEED.as_bytes(),
            config.key().as_ref()
        ],
        bump = config.vault_bump,
    )]
    pub protocol_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Claim<'info> {
    pub fn claim(&mut self, remaining_accounts: &[AccountInfo]) -> Result<()> {
        require!(!self.project.is_active, ClaimError::ProjectNotClosed);
        require!(!self.member.funds_claimed, ClaimError::FundsAlreadyClaimed);

        let mut total_score: u128 = 0;
        for member in remaining_accounts.iter() {
            let member_data = Member::try_deserialize(&mut member.try_borrow_data()?.as_ref())?;
            total_score = total_score.checked_add(member_data.score as u128).unwrap();
        }

        // Claim amount calculation needs to be optimized
        let claim_amount;

        if total_score == 0 {
            // Calculate claim_amount as claimable_funds / number of members
            claim_amount = self
                .project
                .claimable_funds
                .checked_div(remaining_accounts.len() as u64)
                .unwrap();
        } else {
            claim_amount = calculate_claim_amount(
                self.member.score,
                total_score,
                self.project.claimable_funds,
            );
        }

        require!(claim_amount > 0, ClaimError::InsufficientClaimAmount);

        let protocol_fee = claim_amount
            .checked_mul(self.config.fee_basis_points as u64)
            .unwrap()
            .checked_div(10000)
            .unwrap();

        let project_key = self.project.key();
        let seeds = &[
            &VAULT_SEED.as_bytes(),
            project_key.as_ref(),
            &[self.project.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        self.transfer_to_user(
            signer_seeds,
            claim_amount.checked_sub(protocol_fee).unwrap(),
        )?;
        self.transfer_to_protocol_vault(signer_seeds, protocol_fee)?;

        // Check if remaining funds are less than minimum rent
        let min_rent = Rent::get()?.minimum_balance(0);
        if self.vault.lamports() < min_rent {
            self.transfer_to_protocol_vault(signer_seeds, self.vault.lamports())?;
        }

        self.member.funds_claimed = true;

        Ok(())
    }

    fn transfer_to_user(&mut self, signer_seeds: &[&[&[u8]]; 1], amount: u64) -> Result<()> {
        let transfer_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };
        let transfer_ctx = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            transfer_accounts,
            signer_seeds,
        );
        transfer(transfer_ctx, amount)
    }

    fn transfer_to_protocol_vault(
        &mut self,
        signer_seeds: &[&[&[u8]]; 1],
        amount: u64,
    ) -> Result<()> {
        let transfer_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.protocol_vault.to_account_info(),
        };
        let transfer_ctx = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            transfer_accounts,
            signer_seeds,
        );
        transfer(transfer_ctx, amount)
    }
}

fn calculate_claim_amount(member_score: u64, total_score: u128, claimable_funds: u64) -> u64 {
    // Calculate ratio as (member_score * PRECISION) / total_score
    const PRECISION: u128 = 10000;
    let ratio = (member_score as u128)
        .checked_mul(PRECISION)
        .unwrap()
        .checked_div(total_score)
        .unwrap();

    // Calculate claim_amount as (claimable_funds * ratio) / PRECISION
    let claim_amount = (claimable_funds as u128)
        .checked_mul(ratio)
        .unwrap()
        .checked_div(PRECISION)
        .unwrap();

    claim_amount as u64
}
