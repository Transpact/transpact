
extern crate sha2;

use sha2::{Digest, Sha256};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::near_bindgen;

use near_sdk::serde::{Deserialize,Serialize};
use std::fmt::Debug;

#[near_bindgen]
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

#[near_bindgen]
#[derive(Clone,PartialEq,BorshDeserialize,BorshSerialize,Serialize,Deserialize,Debug)]
#[serde(tag = "type", crate = "near_sdk::serde")]
pub struct BuisnessContract{
    
    pub hash: Option<String>,
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
                hash: None,
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

    pub fn generate_hash(&self) -> String {

        let data = format!(
            "{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}",
                self.id.clone(),
                self.contract_type.clone(),
                self.status.clone(),
            
                self.title.clone(),
                self.legal_requirements.clone(),
                self.payment_method.clone(),
                self.total_amount.clone(),
                self.renewal.clone(),
                self.description.clone(),
                
                self.contract_duration.clone(),
                self.budget_range.clone(),

                self.creator_id.clone(),

                self.accepted_bidder.id.clone(),
                self.accepted_bidder.bidder_id.clone(),
                self.accepted_bidder.proposal_description.clone().unwrap_or("".to_string()),
                self.accepted_bidder.quotation_amount.clone(),
            
        );
        
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());

        let result = hasher.finalize();
        let hex_string: String = result.iter().map(|byte| format!("{:02x}", byte)).collect();

        return hex_string;



    }

}



#[near_bindgen]
#[derive(BorshDeserialize,BorshSerialize)]
pub struct Contract {
    contracts: UnorderedMap<String,BuisnessContract>
}



impl Default for Contract{
    fn default() -> Self {

        Self { 
            contracts: UnorderedMap::new(vec![])
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
    
    
    ) -> Option<BuisnessContract>{

        let contract = self.contracts.get(&id);

        match contract{

            Some(_) => {
                return None;
            }
            
            None => {

                let mut contract = BuisnessContract::new(
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
    
                let hash = contract.generate_hash();
                contract.hash = Some(hash);

                self.contracts.insert(&id, &contract);

                return Some(contract);
            }
        }

        

    }

    pub fn check_hash(
        &self,
        id: String,
        contract_type: String,
        status: String,
    
        title: String,
        legal_requirements: String,
        payment_method: String,
        total_amount: i32,
        renewal: bool,
        description: String,
        contract_duration: String,
        budget_range: String,
    
        creator_id: String,
        accepted_bidder: BidderApplication,
    ) -> String {


        let contract = self.contracts.get(&id);

        match contract{

            Some(stored_contract) => {

                let data = format!(
                    "{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}",
                        id.clone(),
                        contract_type.clone(),
                        status.clone(),
                    
                        title.clone(),
                        legal_requirements.clone(),
                        payment_method.clone(),
                        total_amount.clone(),
                        renewal.clone(),
                        description.clone(),
                        
                        contract_duration.clone(),
                        budget_range.clone(),
        
                        creator_id.clone(),
        
                        accepted_bidder.id.clone(),
                        accepted_bidder.bidder_id.clone(),
                        accepted_bidder.proposal_description.clone().unwrap_or("".to_string()),
                        accepted_bidder.quotation_amount.clone(),
                    
                );
                
                let mut hasher = Sha256::new();
                hasher.update(data.as_bytes());
        
                let result = hasher.finalize();
                let hex_string: String = result.iter().map(|byte| format!("{:02x}", byte)).collect();
                
                if stored_contract.hash.unwrap_or("".to_string()) == hex_string {
                    return "VALID".to_string();
                }

                return "INVALID".to_string();

            } 

            None => {
                return "INVALID".to_string();   
            }

        }

    }

    pub fn get_contract(&self, contract_id: String) -> Option<BuisnessContract> {
        return self.contracts.get(&contract_id);
    }

}



#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn create_contract(){
         let mut contract = Contract::default();
         let contract_id = "1234567890".to_string();


         let bidder_application = BidderApplication::new(
            "ajksdhasdi0-d09sad".to_string(),
            1000,
            "dasdjaskdaksd".to_string(),
            Some("Test".to_string()),
            vec!["Hello".to_string(),"World".to_string()]
         );

         let a = contract.create_contract(
            
            contract_id.clone(),
            "FIXED".to_string(),
            "SIGNED".to_string(),
            "Test title".to_string(),
            "test".to_string(),
            "CASH".to_string(),
            1000,
            true,
            "test".to_string(),
            vec!["Hello".to_string(),"World".to_string()],
            vec!["Hello".to_string(),"World".to_string()],
            "10 Months".to_string(),
            "100k - 200k".to_string(),
            "1234567890".to_string(),
            bidder_application,
            
        );


        match a {

            Some(data) => {
                assert_eq!(data.id,contract_id); 
            }   

            None => {
                panic!("Contract does not exitsts");
            }

        }

    }


//    #[test]
//    fn get_contract(){


//         let contract = Contract::default();
//         let contract_id = "1234567890".to_string();
//         let a = contract.get_contract(contract_id.clone());

//         match a {

//             Some(data) => {
//                 assert_eq!(data.id,contract_id); 
//             }   

//             None => {
//                 panic!("Contract does not exitsts");
//             }

//         }

//    }
}