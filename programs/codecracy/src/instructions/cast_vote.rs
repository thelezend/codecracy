use anchor_lang::prelude::*;

use crate::{error::CastVoteError, Member, Poll, Project, MEMBER_SEED};

use super::VoteType;

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,

    pub project: Account<'info, Project>,

    // The member account of the voter
    #[account(
        seeds = [
            MEMBER_SEED.as_bytes(),
            project.key().as_ref(),
            voter.key().as_ref(),
        ],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,

    // The member who initialized the vote
    #[account(
        mut,
        constraint = poll_initializor_member.member_pubkey.key() != voter.key() @CastVoteError::SelfVote
    )]
    pub poll_initializor_member: Account<'info, Member>,

    // The vote account
    #[account(
        constraint = poll.project == project.key() @CastVoteError::InvalidProject,
        constraint = poll.user == poll_initializor_member.member_pubkey.key() @CastVoteError::InvalidVote,
    )]
    pub poll: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

impl<'info> CastVote<'info> {
    pub fn cast_vote(&mut self, vote_type: VoteType) -> Result<()> {
        // Check if the voting period has ended
        if self.poll.close_time < Clock::get()?.unix_timestamp as u64 {
            return Err(CastVoteError::TimeExpired.into());
        }

        todo!("Duplicate votes not allowed");

        if vote_type == VoteType::Reject {
            self.poll.rejections += 1;
        }
        self.poll_initializor_member.score += vote_type as i64;
        self.poll.votes += 1;
        Ok(())
    }
}
