use std::fmt::Debug;
use sha2::digest::crypto_common::InnerUser;
use sha2::{Digest,Sha256};
extern crate hex;

// Find all our documentation at https://docs.near.org
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{log, near_bindgen, AccountId, PublicKey, env};
use near_sdk::serde::{Deserialize,Serialize};

// function to generate User hash
fn generate_user_hash(name: &str, email: &str) -> String{

    let mut hasher = Sha256::new();

    hasher.update(format!("name: {}, email: {}",name,email));

    let hash_result = hasher.finalize();
    let hash_hex_string = hex::encode(hash_result);

    return hash_hex_string

}

#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "enum", crate = "near_sdk::serde")]
pub enum AccountStatus {
    BLOCKED,
    LOCKED,
    ACTIVE,
    UNVERIFIED
}

#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct Lister{
    name: String,
    email: String,
    user_hash: String,
    account_id: AccountId,
    account_status: AccountStatus,
}

impl Lister {
    fn new(name: String, email: String, account_id:AccountId) -> Self {

        let user_hash = generate_user_hash(&name,&email);
        Self {
            name,
            email,
            user_hash: user_hash,
            account_id: account_id,
            account_status: AccountStatus::UNVERIFIED,
        }
    }
}


#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct Contractor{
    name: String,
    email: String,
    user_hash: String,
    account_id: AccountId,
    account_status: AccountStatus,
}


impl Contractor {
    fn new(name: String, email: String, account_id:AccountId) -> Self {

        let user_hash = generate_user_hash(&name,&email);
        Self {
            name,
            email,
            user_hash: user_hash,
            account_id: account_id,
            account_status: AccountStatus::UNVERIFIED,
        }
    }
}

#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct Response{
    status: String,
    message: String,
    data: Option<String>
}


#[near_bindgen]
#[derive(BorshDeserialize,BorshSerialize)]
pub struct Contract {
    listers: UnorderedMap<PublicKey,Lister>,
    contractors: UnorderedMap<PublicKey,Contractor>
}

impl Default for Contract{
    fn default() -> Self {
        Self { 
            listers: UnorderedMap::new(Vec::new()),
            contractors: UnorderedMap::new(Vec::new()),
        }
    }
}

#[near_bindgen]
impl Contract {

    pub fn create_lister(&mut self, name: String, email: String) -> Response{

        let listers_account_id = env::signer_account_id();
        let listers_pub_key = env::signer_account_pk();

        let userExists = self.contractors.get(&listers_pub_key);
        assert_ne!(userExists,None,"User already Exists");

        let mut lister = Lister::new(name,email,listers_account_id);
        lister.account_status = AccountStatus::ACTIVE;

        self.listers.insert(&listers_pub_key,&lister);


        log!("Lister is created successfully name: {}, Total listners: {}", lister.name, self.listers.len());
        return Response{
            status: String::from("CREATED"),
            message: String::from("Lister is created successfully"),
            data: None
        };
    }

    pub fn create_contractor(&mut self, name: String, email: String) -> Response{

        
        let contractors_account_id = env::signer_account_id();
        let contractors_pub_key = env::signer_account_pk();
        
        let userExists = self.contractors.get(&contractors_pub_key);
        assert_ne!(userExists,None,"User already Exists");
       
        // assert_eq!(userExists,),"User already exists");

        let mut contractor = Contractor::new(name,email,contractors_account_id);
        contractor.account_status = AccountStatus::ACTIVE;

        self.contractors.insert(&contractors_pub_key,&contractor);


        log!("Contractor is created successfully name: {}, Total Contractors: {}", contractor.name, self.contractors.len());
        return Response{
            status: String::from("CREATED"),
            message: String::from("Contractor is created successfully"),
            data: None
        };
    }

    pub fn get_yourself(&self) -> Response{

        let pub_id = env::signer_account_pk();

        let lister = self.listers.get(&pub_id);

        match lister {
            Some(lis) =>{
                Response { status: "NOTCREATED".to_string(), message: "User exists".to_string(), data: Some(lis.email)}
            }
            None => {
                Response { status: "NOTCREATED".to_string(), message: "User doesnt exists".to_string(), data: None}
            }

        }
        
    }

}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn get_default_greeting() {
//         let contract = Contract::default();
//         // this test did not call set_greeting so should return the default "Hello" greeting
//         assert_eq!(
//             contract.get_greeting(),
//             "Hello".to_string()
//         );
//     }

//     #[test]
//     fn set_then_get_greeting() {
//         let mut contract = Contract::default();
//         contract.set_greeting("howdy".to_string());
//         assert_eq!(
//             contract.get_greeting(),
//             "howdy".to_string()
//         );
//     }
// }
