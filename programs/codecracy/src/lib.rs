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

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        ctx.accounts.init_config(&ctx.bumps)
    }

    pub fn edit_config(
        ctx: Context<EditConfig>,
        new_admin: Option<Pubkey>,
        fee_basis_points: Option<u16>,
    ) -> Result<()> {
        ctx.accounts.edit_config(new_admin, fee_basis_points)
    }

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

    pub fn add_member(ctx: Context<AddMember>, github_handle: String) -> Result<()> {
        ctx.accounts.add_member(github_handle, &ctx.bumps)?;
        ctx.accounts.update_team_lut()
    }

    pub fn start_poll(ctx: Context<StartPoll>, pull_request: u32, close_time: u64) -> Result<()> {
        ctx.accounts.start_poll(pull_request, close_time)
    }

    pub fn cast_vote(ctx: Context<CastVote>, vote_type: VoteType) -> Result<()> {
        ctx.accounts.cast_vote(vote_type)
    }

    pub fn remove_member(ctx: Context<RemoveMember>) -> Result<()> {
        ctx.accounts.remove_member()
    }

    pub fn close_project(ctx: Context<CloseProject>) -> Result<()> {
        ctx.accounts.close_project()
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        ctx.accounts.claim(ctx.remaining_accounts)
    }
}
