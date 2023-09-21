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
#[derive(BorshDeserialize,BorshSerialize)]
pub struct Contract {
    listers: UnorderedMap<PublicKey,Lister>,
    contractors: UnorderedMap<PublicKey,Contractor>,

    lister_contracts: UnorderedMap<PublicKey,Vec<BuisnessContract>>,
    contractor_contracts: UnorderedMap<PublicKey,Vec<BuisnessContract>>,
}


#[near_bindgen]
impl Default for Contract{
    fn default() -> Self {

        Self { 
            listers: UnorderedMap::new(b"qwerty".to_vec()),
            contractors: UnorderedMap::new(b"qwerty".to_vec()),
            lister_contracts: UnorderedMap::new(Vec::new()),
            contractor_contracts: UnorderedMap::new(Vec::new()),
        }
    }
}

#[near_bindgen]
impl Contract {

    pub fn create_lister(&mut self, name: String, email: String) -> BasicResponse{

        let listers_account_id = env::signer_account_id();
        let listers_pub_key = env::signer_account_pk();


        let mut lister = Lister::new(name,email,listers_account_id);
        lister.account_status = AccountStatus::VERIFIED;

        self.listers.insert(&listers_pub_key,&lister);


        log!("Lister is created successfully name: {}, Total listners: {}", lister.name, self.listers.len());
        return BasicResponse{
            status: String::from("LISTER CREATED"),
            message: String::from("Lister created successfully"),
            data: Some(lister.user_hash)
        };
    }

    pub fn create_contractor(&mut self, name: String, email: String) -> BasicResponse{

        
        let contractors_account_id = env::signer_account_id();
        let contractors_pub_key = env::signer_account_pk();
        
       
        let mut contractor = Contractor::new(name,email,contractors_account_id);
        contractor.account_status = AccountStatus::VERIFIED;

        self.contractors.insert(&contractors_pub_key,&contractor);


        log!("Contractor is created successfully name: {}, Total Contractors: {}", contractor.name, self.contractors.len());
        return BasicResponse{
            status: String::from("CONTRACTOR CREATED"),
            message: String::from("Contractor is created successfully"),
            data: Some(contractor.user_hash)
        };
    }

    pub fn get_user(&self) -> BasicResponse{

        let pub_id = env::signer_account_pk();

        let lister: Option<Lister> = self.listers.get(&pub_id);
        let contractors: Option<Contractor> = self.contractors.get(&pub_id);

        match lister {
            Some(lis) =>{
                BasicResponse { status: "LISTER".to_string(), message: "User exists".to_string(), data: Some(lis.user_hash)}
            }
            None => {

                match contractors {
                    Some(contr) =>{
                        BasicResponse { status: "CONTRACTOR".to_string(), message: "User exists".to_string(), data: Some(contr.user_hash)}
                    }
                    None => {
                        BasicResponse { status: "NOTCREATED".to_string(), message: "User Does Not exists".to_string(), data: None}
                    }
                }

            }

        }
        
    }

    pub fn remove_user(&mut self) -> BasicResponse{

        let pub_id = env::signer_account_pk();

        let lister: Option<Lister> = self.listers.get(&pub_id);
        let contractors: Option<Contractor> = self.contractors.get(&pub_id);

        match lister {
            Some(lis) =>{
                
                self.listers.remove(&pub_id);
                BasicResponse { status: "REMOVED".to_string(), message: "Lister REMOVED".to_string(), data: Some(lis.user_hash)}
            }
            None => {

                match contractors {
                    Some(contr) =>{
                        self.listers.remove(&pub_id);
                        BasicResponse { status: "REMOVED".to_string(), message: "Contractor REMOVED".to_string(), data: Some(contr.user_hash)}                    }
                    None => {
                        BasicResponse { status: "NOTCREATED".to_string(), message: "User Does Not exists".to_string(), data: None}
                    }
                }

            }

        }
        
    }

    pub fn create_contract(&mut self,title: String,description: String,is_milestoned: bool,start_date: Timestamp,end_date: Timestamp) -> BasicResponse{

        let lister_accound_id: AccountId = env::signer_account_id();
        let lister_pub_key = env::signer_account_pk();
        

        let lister = self.listers.get(&lister_pub_key);
        match lister {
            Some(litr) => {

                // assert_ne!(litr.account_status,AccountStatus::VERIFIED, "User is prohibitted by Community");

                let contract = BuisnessContract::new(
                    title,
                    description,
                    None,
                    lister_pub_key,
                    is_milestoned,
                    start_date,
                    end_date,
                );

                return BasicResponse { status: "CREATED".to_string(), message: "Contract created successfully".to_string(), data: Some(contract.contract_id)}


            }
            None => {
                return BasicResponse { status: "NOTCREATED".to_string(), message: "Invalid/Unregisterd User".to_string(), data: None}
            }
        }

    }   


    pub fn get_your_contracts(&self) -> MultipleContractsResponse{
        // returns contracts created by a lister
        let lister_pk = env::signer_account_pk();

        let lister_contracts = self.lister_contracts.get(&lister_pk);

        let lister_contract_response:Vec<ContractResponse> = Vec::new();

        match lister_contracts {
            Some(lst_contracts)=>{

                for contract in lst_contracts.iter(){

                    let resp = ContractResponse{
                        title: contract.title,
                        contract_id: contract.contract_id,
                        description: contract.description,
                        start_date: contract.start_date,
                        end_date: contract.end_date,
                        lister: contract.lister,
                        is_milestoned: contract.is_milestoned,
                    };
                }

                return MultipleContractsResponse{status: "SUCCESS".to_string(), contracts: Vec::new()};
            }
            None => {
                return MultipleContractsResponse { status: "USER_NOTFOUND".to_string(), contracts: Vec::new()};
            }
        }

        

    }

}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn create_lister(){
         let mut contract = Contract::default();
         let a: BasicResponse = contract.create_lister("swapnil".to_string(),"swapnil@gmail.com".to_string());
         let b = contract.create_lister("swapnil".to_string(),"swapnil@gmail.com".to_string());
         contract.create_lister("swapnil".to_string(),"swapnil@gmail.com".to_string());
         contract.create_lister("swapnil".to_string(),"swapnil@gmail.com".to_string());

         assert_eq!(contract.listers.len(),1);
         assert_eq!(a.status,"CREATED");
         assert_eq!(b.status,"CREATED");
 
    }


   #[test]
   fn get_me(){
        let mut contract = Contract::default();
        contract.create_lister("swapnil".to_string(),"swapnil@gmail.com".to_string());

        let a: BasicResponse = contract.get_user();
        assert_eq!(a.message,"NOTCREATED");

   }
}