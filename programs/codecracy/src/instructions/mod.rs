pub mod initialize_project;
pub use initialize_project::*;

pub mod change_admin;
pub use change_admin::*;

pub mod add_member;
pub use add_member::*;

pub mod remove_member;
pub use remove_member::*;

pub mod close_project;
pub use close_project::*;

pub mod initialize_vote;
pub use initialize_vote::*;

pub mod cast_vote;
pub use cast_vote::*;

#[derive(Copy, Clone, PartialEq, Eq)]
pub enum VoteType {
    Low = 10,
    Medium = 20,
    High = 50,
    Reject = -20,
}
