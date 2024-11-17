use anchor_lang::prelude::*;

#[error_code]
pub enum ProjectInitializationError {
    #[msg(format!("Length of the project name must be between 1 and {} characters", MAX_PROJECT_NAME_LENGTH))]
    InvalidProjectName,

    #[msg(format!("Length of the github handle must be between 1 and {} characters", MAX_GITHUB_HANDLE_LENGTH))]
    InvalidGithubHandle,
}
