use anchor_lang::prelude::*;

use crate::{Member, Poll, Project, MEMBER_SEED, POLL_SEED};

#[derive(Accounts)]
#[instruction(pull_request: u32)]
pub struct InitializePoll<'info> {
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
        space = Poll::INIT_SPACE + 8,
        seeds = [
            POLL_SEED.as_bytes(),
            pull_request.to_le_bytes().as_ref(),
            project.key().as_ref(),
        ],
        bump
    )]
    pub poll: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializePoll<'info> {
    pub fn initialize_poll(&mut self, pull_request: u32, close_time: u64) -> Result<()> {
        self.poll.set_inner(Poll {
            user: self.user.key(),
            pull_request,
            project: self.project.key(),
            votes: 0,
            close_time,
            rejections: 0,
            bump: self.poll.bump,
        });
        Ok(())
    }
}
