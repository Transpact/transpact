use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize,Serialize};


#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "enum", crate = "near_sdk::serde")]
pub enum AccountStatus {
    BLOCKED,
    LOCKED,
    VERIFIED,
    UNVERIFIED
}