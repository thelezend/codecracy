use crate::{
    error::ProjectInitializationError, Project, MAX_GITHUB_HANDLE_LENGTH, MAX_PROJECT_NAME_LENGTH,
    PROJECT_CONFIG_SEED, VAULT_SEED,
};
use anchor_lang::prelude::*;

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
    pub project_config: Account<'info, Project>,

    /// Project vault that will hold the project's funds
    /// This PDA is derived from the project_config PDA
    #[account(
        seeds = [
            VAULT_SEED.as_bytes(),
            project_config.key().as_ref()
        ],
        bump,
    )]
    pub vault: SystemAccount<'info>,

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

        self.project_config.set_inner(Project {
            admin: self.admin.key(),
            project_name,
            github_handle,
            bump: bumps.project_config,
            vault_bump: bumps.vault,
        });

        Ok(())
    }
}
