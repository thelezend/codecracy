use anchor_lang::prelude::*;

use crate::{error::CastVoteError, Member, Poll, Project, Vote, VoteType, VOTE_SEED};

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,

    pub project: Account<'info, Project>,

    // The member who initialized the poll
    #[account(
        mut,
        constraint = poll_initializor_member.member_pubkey.key() != voter.key() @CastVoteError::SelfVote
    )]
    pub poll_initializor_member: Account<'info, Member>,

    // The poll account
    #[account(
        constraint = poll.project == project.key() @CastVoteError::InvalidProject,
        constraint = poll.user == poll_initializor_member.member_pubkey.key() @CastVoteError::InvalidPoll,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        init_if_needed,
        payer = voter,
        space = Vote::INIT_SPACE + 8,
        seeds = [
            VOTE_SEED.as_bytes(),
            poll.key().as_ref(),
            voter.key().as_ref(),
        ],
        bump
    )]
    pub vote: Account<'info, Vote>,

    pub system_program: Program<'info, System>,
}

impl<'info> CastVote<'info> {
    pub fn cast_vote(&mut self, vote_type: VoteType) -> Result<()> {
        // Check if the voting period has ended
        if self.poll.close_time < Clock::get()?.unix_timestamp as u64 {
            return Err(CastVoteError::TimeExpired.into());
        }

        if vote_type == VoteType::Reject {
            self.poll.rejections += 1;
        }
        self.poll_initializor_member.score += vote_type as i64;
        self.poll.votes += 1;

        self.vote.set_inner(Vote {
            voter: self.voter.key(),
            project: self.project.key(),
            poll: self.poll.key(),
            vote_type,
            bump: self.vote.bump,
        });
        Ok(())
    }
}