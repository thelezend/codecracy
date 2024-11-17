use anchor_lang::prelude::*;

// Seeds
#[constant]
pub const PROJECT_CONFIG_SEED: &str = "project-config";
#[constant]
pub const VAULT_SEED: &str = "vault";

pub const ADDRESS_LOOK_UP_TABLE_PROGRAM: &str = "AddressLookupTab1e1111111111111111111111111";

pub const MAX_PROJECT_NAME_LENGTH: u8 = 32;
pub const MAX_GITHUB_HANDLE_LENGTH: u8 = 32;
