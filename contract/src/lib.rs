extern crate hex;

use std::fmt::Debug;
use sha2::{Digest,Sha256};

// Find all our documentation at https://docs.near.org
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap,UnorderedSet};
use near_sdk::{log, near_bindgen, AccountId, PublicKey, env, Balance, Timestamp};
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
    VERIFIED,
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
            user_hash,
            account_id,
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
    license_number: String,
}


impl Contractor {
    fn new(name: String, email: String, account_id:AccountId, license_number:String) -> Self {

        let user_hash = generate_user_hash(&name,&email);
        Self {
            name,
            email,
            user_hash,
            account_id,
            account_status: AccountStatus::UNVERIFIED,
            license_number,
        }
    }
}



#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct MultiSigWallet{
    owners: Vec<AccountId>,
    users: Vec<AccountId>,
    required_confirmations: u8,
    total_reserves: Balance, 
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

    contract_id: String,
    title: String,
    description: String,
    contractor: Option<PublicKey>,
    lister: PublicKey,
    is_milestoned: bool,
    start_date: Timestamp,
    end_date: Timestamp,
    wallet: MultiSigWallet,
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
    contractors: UnorderedMap<PublicKey,Contractor>,

    lister_contracts: UnorderedMap<PublicKey,UnorderedSet<BuisnessContract>>,
    contractor_contracts: UnorderedMap<PublicKey,UnorderedSet<BuisnessContract>>,
}



impl Default for Contract{
    fn default() -> Self {
        Self { 
            listers: UnorderedMap::new(Vec::new()),
            contractors: UnorderedMap::new(Vec::new()),
            lister_contracts: UnorderedMap::new(Vec::new()),
            contractor_contracts: UnorderedMap::new(Vec::new()),
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
        lister.account_status = AccountStatus::VERIFIED;

        self.listers.insert(&listers_pub_key,&lister);


        log!("Lister is created successfully name: {}, Total listners: {}", lister.name, self.listers.len());
        return Response{
            status: String::from("CREATED"),
            message: String::from("Lister is created successfully"),
            data: None
        };
    }

    pub fn create_contractor(&mut self, name: String, email: String,license_number:String) -> Response{

        
        let contractors_account_id = env::signer_account_id();
        let contractors_pub_key = env::signer_account_pk();
        
        let userExists = self.contractors.get(&contractors_pub_key);
        assert_ne!(userExists,None,"User already Exists");
       
        // assert_eq!(userExists,),"User already exists");

        let mut contractor = Contractor::new(name,email,contractors_account_id,license_number);
        contractor.account_status = AccountStatus::VERIFIED;

        self.contractors.insert(&contractors_pub_key,&contractor);


        log!("Contractor is created successfully name: {}, Total Contractors: {}", contractor.name, self.contractors.len());
        return Response{
            status: String::from("CREATED"),
            message: String::from("Contractor is created successfully"),
            data: None
        };
    }

    pub fn get_user(&self) -> Response{

        let pub_id = env::signer_account_pk();

        let lister: Option<Lister> = self.listers.get(&pub_id);
        let contractors: Option<Contractor> = self.contractors.get(&pub_id);

        match lister {
            Some(lis) =>{
                Response { status: "NOTCREATED".to_string(), message: "User exists".to_string(), data: Some(lis.user_hash)}
            }
            None => {

                match contractors {
                    Some(contr) =>{
                        Response { status: "NOTCREATED".to_string(), message: "User exists".to_string(), data: Some(contr.user_hash)}
                    }
                    None => {
                        Response { status: "NOTCREATED".to_string(), message: "User Does Not exists".to_string(), data: None}
                    }
                }

            }

        }
        
    }

    pub fn create_contract(&mut self,title: String,description: String,is_milestoned: bool,start_date: Timestamp,end_date: Timestamp) -> Response{

        let lister_accound_id: AccountId = env::signer_account_id();
        let lister_pub_key = env::signer_account_pk();
        

        let lister = self.listers.get(&lister_pub_key);
        match lister {
            Some(litr) => {
                assert_ne!(litr.account_status,AccountStatus::VERIFIED, "User is prohibitted by Community");

                let contract = BuisnessContract::new(
                    title,
                    description,
                    None,
                    lister_pub_key,
                    is_milestoned,
                    start_date,
                    end_date,
                );

                return Response { status: "NOTCREATED".to_string(), message: "Invalid/Unregisterd User".to_string(), data: None}


            }
            None => {
                return Response { status: "NOTCREATED".to_string(), message: "Invalid/Unregisterd User".to_string(), data: None}
            }
        }

        // let contract = 

        // contract_id: String,
        // title: String,
        // description: String,
        // contractor: PublicKey,
        // lister: PublicKey,
        // is_milestoned: bool,
        // start_date: Timestamp,
        // end_date: Timestamp,
        // wallet: MultiSigWallet,

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
