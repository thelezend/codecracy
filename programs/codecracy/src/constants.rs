use anchor_lang::prelude::*;

// Seeds
#[constant]
pub const CONFIG_SEED: &str = "config";
#[constant]
pub const PROJECT_CONFIG_SEED: &str = "project-config";
#[constant]
pub const VAULT_SEED: &str = "vault";
#[constant]
pub const MEMBER_SEED: &str = "member";
#[constant]
pub const POLL_SEED: &str = "poll";
#[constant]
pub const VOTE_SEED: &str = "vote";

pub const ADDRESS_LOOK_UP_TABLE_PROGRAM: &str = "AddressLookupTab1e1111111111111111111111111";

pub const MAX_PROJECT_NAME_LENGTH: u8 = 32;
pub const MAX_GITHUB_HANDLE_LENGTH: u8 = 32;

pub const FEE_BASIS_POINTS: u16 = 2000;
