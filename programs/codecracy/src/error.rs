use anchor_lang::prelude::*;

#[error_code]
pub enum ProjectInitializationError {
    #[msg("Length of the project name must be between 1 and 32 characters")]
    InvalidProjectName,

    #[msg("Length of the github handle must be between 1 and 32 characters")]
    InvalidGithubHandle,

    #[msg("Invalid address lookup table account")]
    InvalidAddressLookupTable,

    #[msg("Invalid address lookup table program")]
    InvalidAddressLookupTableProgram,
}
