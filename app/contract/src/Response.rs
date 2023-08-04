
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize,Serialize};
use near_sdk::{AccountId};
use crate::Types::{AccountStatus};

#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct BasicResponse{
    pub status: String,
    pub message: String,
    pub data: Option<String>
}


#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct ContractResponse{
    pub contract_id: String,
    pub title: String,
    pub description: String,
    pub lister: String,
    pub is_milestoned: bool,
    pub start_date: u64,
    pub end_date: u64,
}

#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct MultipleContractsResponse{
    pub status: String,
    pub contracts: Vec<ContractResponse>
}




