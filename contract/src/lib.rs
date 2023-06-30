// Find all our documentation at https://docs.near.org
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{log, near_bindgen, AccountId, PublicKey, env};
use near_sdk::serde::{Deserialize,Serialize};

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

        Self {
            name,
            email,
            user_hash: "dasjd".to_string(),
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

        Self {
            name,
            email,
            user_hash: "dasjd".to_string(),
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
