
extern crate sha2;
extern crate serde;
extern crate serde_json;

use serde::{Serialize as SerdeSerialize, Deserialize as SerdeDeserialize };
use serde_json::to_string;
use crypto_hash::{hex_digest, Algorithm};

use sha2::{Digest, Sha256};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::near_bindgen;

use near_sdk::serde::{Deserialize,Serialize};
use std::fmt::Debug;


fn calculate_hash<T: SerdeSerialize>(data: &T) -> String {

    let serialized = serde_json::to_string(data).expect("Serialization failed");

    let hash = hex_digest(Algorithm::SHA256, serialized.as_bytes());

    return hash;

}

#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct BidderApplication {

    pub id: String,
    pub quotation_amount: i32,
    pub bidder_id: String,
    pub proposal_description: Option<String>,
    pub files: Vec<String>
   
}

impl BidderApplication {

    pub fn new(
        id: String,
        quotation_amount: i32,
        bidder_id: String,
        proposal_description: Option<String>,
        files: Vec<String>
    ) -> BidderApplication {

        Self { 
            id,
            quotation_amount,
            bidder_id,
            proposal_description,
            files
        }


    }

}

#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct BuisnessContract{
    
    pub id: String,
    pub contract_type: String,
    pub status: String,

    pub title: String,
    pub skills_required: Vec<String>,
    pub legal_requirements: String,
    pub payment_method: String,
    pub total_amount: i32,
    pub renewal: bool,
    pub description: String,
    
    pub contract_duration: String,
    pub budget_range: String,
    pub files: Vec<String>,

    pub creator_id: String,
    pub accepted_bidder: BidderApplication,
}

impl BuisnessContract{

    pub fn new( 
        
        id: String,
        contract_type: String,
        status: String,
    
        title: String,
        skills_required: Vec<String>,
        legal_requirements: String,
        payment_method: String,
        total_amount: i32,
        renewal: bool,
        description: String,
        
        contract_duration: String,
        budget_range: String,
        files: Vec<String>,
    
        creator_id: String,
        accepted_bidder: BidderApplication,
    
    ) -> BuisnessContract{

            // let wallet = MultiSigWallet{
            //     owners: Vec::new(),
            //     users: Vec::new(),
            //     required_confirmations: 1,
            //     total_reserves: 0
            // };
            // let contract_id = generate_user_hash(&title,&description);

            Self{

                id,
                contract_type,
                status,
            
                title,
                skills_required,
                legal_requirements,
                payment_method,
                total_amount,
                renewal,
                description,
                
                contract_duration,
                budget_range,
                files,
            
                creator_id,
                accepted_bidder,
            
            }

        }

}



#[near_bindgen]
#[derive(BorshDeserialize,BorshSerialize)]
pub struct Contract {
    contracts: UnorderedMap<String,BuisnessContract>,
    contracts_hash: UnorderedMap<String,String>
}



impl Default for Contract{
    fn default() -> Self {

        Self { 
            contracts: UnorderedMap::new(b"".to_vec()),
            contracts_hash: UnorderedMap::new(b"".to_vec())
        }
    }
}


#[near_bindgen]
impl Contract {


    pub fn create_contract(
        &mut self,
        
        id: String,
        contract_type: String,
        status: String,
    
        title: String,
        legal_requirements: String,
        payment_method: String,
        total_amount: i32,
        renewal: bool,
        description: String,
        skills_required: Vec<String>,
        files: Vec<String>,
        contract_duration: String,
        budget_range: String,
    
        creator_id: String,
        accepted_bidder: BidderApplication,
    
    
    ) -> String{

        let contract = self.contracts.get(&id);

        match contract{

            Some(_) => {
                return "Contract already exists".to_string();
            }
            
            None => {

                let contract = BuisnessContract::new(
                    id.clone(),
                    contract_type,
                    status,
                    title,
                    skills_required,
                    legal_requirements,
                    payment_method,
                    total_amount,
                    renewal,
                    description,
                    
                    contract_duration,
                    budget_range,
                    files,
                
                    creator_id,
                    accepted_bidder.clone(),
                );
    
                self.contracts.insert(&id, &contract);

                let hash = calculate_hash(contract);

            
                return "Contract added".to_string();
            }
        }

        

    }

    pub fn get_contract(&self, contract_id: String) -> Option<BuisnessContract> {

        return self.contracts.get(&contract_id);

    }

}