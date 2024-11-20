use anchor_lang::prelude::*;

use crate::{Member, Project, Vote, MEMBER_SEED, VOTE_SEED};

#[derive(Accounts)]
#[instruction(pull_request: u32)]
pub struct InitializeVote<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub project: Account<'info, Project>,

    #[account(
        seeds = [
            MEMBER_SEED.as_bytes(),
            project.key().as_ref(),
            user.key().as_ref(),
        ],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,

    #[account(
        init,
        payer = user,
        space = Vote::INIT_SPACE + 8,
        seeds = [
            VOTE_SEED.as_bytes(),
            pull_request.to_le_bytes().as_ref(),
            project.key().as_ref(),
        ],
        bump
    )]
    pub vote: Account<'info, Vote>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeVote<'info> {
    pub fn initialize_vote(&mut self, pull_request: u32, close_time: u64) -> Result<()> {
        self.vote.set_inner(Vote {
            user: self.user.key(),
            pull_request,
            project: self.project.key(),
            votes: 0,
            close_time,
            rejections: 0,
            bump: self.vote.bump,
        });
        Ok(())
    }
}
