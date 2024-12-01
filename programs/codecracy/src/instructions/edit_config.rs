use anchor_lang::prelude::*;

use crate::{Config, CONFIG_SEED};

#[derive(Accounts)]
pub struct EditConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [
            CONFIG_SEED.as_bytes(),
        ],
        bump = config.bump,
        has_one = admin,
    )]
    pub config: Account<'info, Config>,
}

impl<'info> EditConfig<'info> {
    pub fn edit_config(
        &mut self,
        new_admin: Option<Pubkey>,
        fee_basis_points: Option<u16>,
    ) -> Result<()> {
        if let Some(new_admin) = new_admin {
            self.config.admin = new_admin;
        }
        if let Some(fee_basis_points) = fee_basis_points {
            self.config.fee_basis_points = fee_basis_points;
        }
        Ok(())
    }
}
