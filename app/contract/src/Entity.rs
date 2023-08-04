use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap,UnorderedSet};
use near_sdk::{log, near_bindgen, AccountId, PublicKey, env, Balance, Timestamp};
use near_sdk::serde::{Deserialize,Serialize};
use std::fmt::Debug;
use sha2::{Digest,Sha256};

use crate::Types::AccountStatus;


// function to generate User hash
fn generate_user_hash(name: &str, email: &str) -> String{

    let mut hasher = Sha256::new();

    hasher.update(format!("name: {}, email: {}",name,email));

    let hash_result = hasher.finalize();
    let hash_hex_string = hex::encode(hash_result);

    return hash_hex_string

}


#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct Lister{
    pub name: String,
    pub email: String,
    pub user_hash: String,
    pub account_id: AccountId,
    pub account_status: AccountStatus,
}

impl Lister {
    pub fn new(name: String, email: String, account_id:AccountId) -> Self {

        let user_hash = generate_user_hash(&name,&email);
        Self {
            name,
            email,
            user_hash,
            account_id,
            account_status: AccountStatus::UNVERIFIED,
        }
    }
}


#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct Contractor{
    pub name: String,
    pub email: String,
    pub user_hash: String,
    pub account_id: AccountId,
    pub account_status: AccountStatus,
}


impl Contractor {
    pub fn new(name: String, email: String, account_id:AccountId) -> Self {

        let user_hash = generate_user_hash(&name,&email);
        Self {
            name,
            email,
            user_hash,
            account_id,
            account_status: AccountStatus::UNVERIFIED,
        }
    }
}



#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct MultiSigWallet{
    pub owners: Vec<AccountId>,
    pub users: Vec<AccountId>,
    pub required_confirmations: u8,
    pub total_reserves: Balance, 
}

impl MultiSigWallet {
    
    pub fn new(owners: Vec<AccountId>,users: Vec<AccountId>,required_confirmations: u8) -> MultiSigWallet{
        Self {
            owners,
            users,
            required_confirmations,
            total_reserves: 0,
        }
    }
}



#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct BuisnessContract{
    pub contract_id: String,
    pub title: String,
    pub description: String,
    pub contractor: Option<PublicKey>,
    pub lister: PublicKey,
    pub is_milestoned: bool,
    pub start_date: Timestamp,
    pub end_date: Timestamp,
    pub wallet: MultiSigWallet,
}

impl BuisnessContract{

    pub fn new( 
        title: String,
        description: String,
        contractor: Option<PublicKey>,
        lister: PublicKey,
        is_milestoned: bool,
        start_date: Timestamp,
        end_date: Timestamp) -> BuisnessContract{

            let wallet = MultiSigWallet{
                owners: Vec::new(),
                users: Vec::new(),
                required_confirmations: 1,
                total_reserves: 0
            };
            let contract_id = generate_user_hash(&title,&description);

            Self{
                contract_id,
                title,
                description,
                contractor,
                lister,
                is_milestoned,
                start_date,
                end_date,
                wallet
            }

        }

}

