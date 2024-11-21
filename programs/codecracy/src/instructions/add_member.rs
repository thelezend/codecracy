use std::str::FromStr;

use anchor_lang::{
    prelude::*,
    solana_program::{
        address_lookup_table::instruction::extend_lookup_table, program::invoke_signed,
    },
};

use crate::{
    error::LookupTableError, Member, Project, ADDRESS_LOOK_UP_TABLE_PROGRAM, MEMBER_SEED,
    PROJECT_CONFIG_SEED,
};

#[derive(Accounts)]
pub struct AddMember<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    pub new_user: SystemAccount<'info>,

    #[account(
        has_one = admin
    )]
    pub project: Account<'info, Project>,

    #[account(
        init,
        payer = admin,
        space = Member::INIT_SPACE + 8,
        seeds = [
            MEMBER_SEED.as_bytes(),
            project.key().as_ref(),
            new_user.key().as_ref()
            ],
        bump
    )]
    pub member: Account<'info, Member>,

    /// CHECK: Checking manually
    #[account(
        mut,
        constraint = team_lut.key() == project.team_lut.key() @ LookupTableError::InvalidAddressLookupTable
    )]
    pub team_lut: UncheckedAccount<'info>,

    /// CHECK: Checking manually
    #[account(
        constraint = atl_program.key() == Pubkey::from_str(ADDRESS_LOOK_UP_TABLE_PROGRAM).unwrap() @ LookupTableError::InvalidAddressLookupTableProgram
    )]
    pub atl_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> AddMember<'info> {
    pub fn add_member(
        &mut self,
        name: String,
        github_handle: String,
        bumps: &AddMemberBumps,
    ) -> Result<()> {
        self.member.set_inner(Member {
            name,
            github_handle,
            member_pubkey: self.new_user.key(),
            project: self.project.key(),
            score: 0,
            is_active: true,
            funds_claimed: false,
            bump: bumps.member,
        });

        Ok(())
    }

    pub fn update_team_lut(&mut self) -> Result<()> {
        let seeds = &[
            &PROJECT_CONFIG_SEED.as_bytes()[..],
            &self.project.project_name.as_bytes()[..],
            &self.project.github_handle.as_bytes()[..],
            &[self.project.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_ix = extend_lookup_table(
            self.team_lut.key(),
            self.project.key(),
            Some(self.admin.key()),
            vec![self.member.key()],
        );
        let cpi_account_infos = [
            self.team_lut.to_account_info(),
            self.project.to_account_info(),
            self.admin.to_account_info(),
            self.system_program.to_account_info(),
        ];

        invoke_signed(&cpi_ix, &cpi_account_infos, signer_seeds)?;

        Ok(())
    }
}
