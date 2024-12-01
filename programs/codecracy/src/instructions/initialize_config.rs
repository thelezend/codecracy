use anchor_lang::prelude::*;

use crate::{Config, CONFIG_SEED, FEE_BASIS_POINTS, VAULT_SEED};

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = Config::INIT_SPACE + 8,
        seeds = [
            CONFIG_SEED.as_bytes(),
        ],
        bump
    )]
    pub config: Account<'info, Config>,

    #[account(
        seeds = [
            VAULT_SEED.as_bytes(),
            config.key().as_ref()
        ],
        bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeConfig<'info> {
    pub fn init_config(&mut self, bumps: &InitializeConfigBumps) -> Result<()> {
        self.config.set_inner(Config {
            admin: self.admin.key(),
            vault: self.vault.key(),
            fee_basis_points: FEE_BASIS_POINTS,
            bump: bumps.config,
            vault_bump: bumps.vault,
        });
        Ok(())
    }
}
