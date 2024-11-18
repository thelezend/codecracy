use std::str::FromStr;

use crate::{
    error::{LookupTableError, ProjectInitializationError},
    Project, ADDRESS_LOOK_UP_TABLE_PROGRAM, MAX_GITHUB_HANDLE_LENGTH, MAX_PROJECT_NAME_LENGTH,
    PROJECT_CONFIG_SEED, VAULT_SEED,
};
use anchor_lang::{
    prelude::*,
    solana_program::{address_lookup_table::instruction::create_lookup_table, program::invoke},
};

/// Accounts and data required for initializing a new project
#[derive(Accounts)]
#[instruction(project_name: String, github_handle: String)]
pub struct InitializeProject<'info> {
    /// The creator/admin of the project who will pay for initialization
    #[account(mut)]
    pub admin: Signer<'info>,

    /// Project configuration account that stores project details
    /// This PDA is derived from the project name and Github handle
    #[account(
        init,
        payer = admin,
        space = Project::INIT_SPACE + 8,
        seeds = [
            PROJECT_CONFIG_SEED.as_bytes(),
            project_name.as_bytes(),
            github_handle.as_bytes(),
        ],
        bump
    )]
    pub project: Account<'info, Project>,

    /// Project vault that will hold the project's funds
    /// This PDA is derived from the project_config PDA
    #[account(
        seeds = [
            VAULT_SEED.as_bytes(),
            project.key().as_ref()
        ],
        bump,
    )]
    pub vault: SystemAccount<'info>,

    /// CHECK: Verified in the instruction
    #[account(mut)]
    pub lookup_table: UncheckedAccount<'info>,

    /// CHECK: No Lookup table program found in anchor, checking manually
    #[account(
        constraint = atl_program.key() == Pubkey::from_str(ADDRESS_LOOK_UP_TABLE_PROGRAM).unwrap() @ LookupTableError::InvalidAddressLookupTableProgram
    )]
    pub atl_program: UncheckedAccount<'info>,

    /// Required system program
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeProject<'info> {
    pub fn init_project(
        &mut self,
        project_name: String,
        github_handle: String,
        bumps: &InitializeProjectBumps,
    ) -> Result<()> {
        // Validate project name
        require!(
            !project_name.is_empty() && project_name.len() <= MAX_PROJECT_NAME_LENGTH as usize,
            ProjectInitializationError::InvalidProjectName
        );

        // Validate Github handle
        require!(
            !github_handle.is_empty() && github_handle.len() <= MAX_GITHUB_HANDLE_LENGTH as usize,
            ProjectInitializationError::InvalidGithubHandle
        );

        // Initialize project
        let project = &mut self.project;
        project.admin = self.admin.key();
        project.project_name = project_name;
        project.github_handle = github_handle;
        project.bump = bumps.project;
        project.vault_bump = bumps.vault;

        Ok(())
    }

    pub fn create_lookup_table(&mut self, slot: u64) -> Result<()> {
        // Create address lookup table instruction
        let (atl_ix, atl_pubkey) = create_lookup_table(self.project.key(), self.admin.key(), slot);

        // Require address lookup table to be present
        require!(
            self.lookup_table.key() == atl_pubkey,
            LookupTableError::InvalidAddressLookupTable
        );

        // Create address lookup table
        invoke(
            &atl_ix,
            &[
                self.lookup_table.to_account_info(),
                self.project.to_account_info(),
                self.admin.to_account_info(),
                self.system_program.to_account_info(),
            ],
        )?;

        // Set address lookup table
        self.project.lookup_table = self.lookup_table.key();

        Ok(())
    }
}
