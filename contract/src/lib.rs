extern crate hex;
mod Response;
pub mod Types;
pub mod Entity;

use std::io::Read;

use Response::{BasicResponse,ContractResponse,MultipleContractsResponse};
use Entity::{BuisnessContract,Lister,Contractor};
use Types::AccountStatus;

// Find all our documentation at https://docs.near.org
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap,UnorderedSet};
use near_sdk::{log, near_bindgen, AccountId, PublicKey, env, Timestamp};


#[near_bindgen]
#[derive(BorshSerialize,BorshDeserialize)]
pub struct Contract{
    name: String
}


impl Default for Contract{
    fn default() -> Self {
        Self{
            name: String::from("Swapnil")
        }
    }
}

#[near_bindgen]
impl Contract{


    pub fn get_name(&self) -> String{
        return self.name.clone();
    }

    pub fn change_name(&mut self,name:String) -> String {
        self.name = name;
        return String::from("Done");
    }


}


