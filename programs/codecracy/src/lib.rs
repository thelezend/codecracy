pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("j8RWHX7RcLfWxkimpbgrSv6cPjUdpdGvjj3n3ikd53S");

#[program]
pub mod codecracy {

    use super::*;

    pub fn initialize_project(
        ctx: Context<InitializeProject>,
        project_name: String,
        github_handle: String,
        slot: u64,
    ) -> Result<()> {
        ctx.accounts
            .init_project(project_name, github_handle, &ctx.bumps)?;
        ctx.accounts.create_lookup_table(slot)
    }

    pub fn change_admin(ctx: Context<AdminChange>) -> Result<()> {
        ctx.accounts.change_admin()
    }

    pub fn add_member(
        ctx: Context<AddMember>,
        member_name: String,
        github_handle: String,
    ) -> Result<()> {
        ctx.accounts
            .add_member(member_name, github_handle, &ctx.bumps)?;
        ctx.accounts.update_team_lut()
    }

    pub fn remove_member(ctx: Context<RemoveMember>) -> Result<()> {
        ctx.accounts.remove_member()
    }
}
