use anchor_lang::prelude::*;

#[error_code]
pub enum ProjectInitializationError {
    #[msg("Length of the project name must be between 1 and 32 characters")]
    InvalidProjectName,

    #[msg("Length of the github handle must be between 1 and 32 characters")]
    InvalidGithubHandle,
}

#[error_code]
pub enum LookupTableError {
    #[msg("Invalid address lookup table account")]
    InvalidAddressLookupTable,

    #[msg("Invalid address lookup table program")]
    InvalidAddressLookupTableProgram,
}

#[error_code]
pub enum CastVoteError {
    #[msg("The Vote account doesn't belong to the project")]
    InvalidProject,

    #[msg("The Vote account doesn't belong to the member")]
    InvalidVote,

    #[msg("Self vote is not allowed")]
    SelfVote,

    #[msg("Vote time has expired")]
    TimeExpired,
}
