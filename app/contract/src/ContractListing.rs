use near_sdk::{env, near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}, collections::HashMap};

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    road_length: u32,
    road_type: String,
    start_date: String,
    end_date: String,
    budget: u64,
    bids: Vec<Bid>,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Bid {
    bidder: String,
    amount: u64,
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct ContractListing {
    contracts: HashMap<u64, Contract>,
}

#[near_bindgen]
impl ContractListing {
    pub fn add_contract(
        &mut self,
        road_length: u32,
        road_type: String,
        start_date: String,
        end_date: String,
        budget: u64,
    ) {
        let contract = Contract {
            road_length,
            road_type,
            start_date,
            end_date,
            budget,
            bids: Vec::new(),
        };
        self.contracts.insert(self.contracts.len() as u64, contract);
    }

    pub fn get_total_contracts(&self) -> u64 {
        self.contracts.len() as u64
    }

    pub fn get_contract_details(&self, index: u64) -> Option<Contract> {
        self.contracts.get(&index).cloned()
    }

    pub fn get_all_contracts(&self) -> Vec<Contract> {
        self.contracts.values().cloned().collect()
    }

    pub fn submit_bid(&mut self, index: u64, bidder: String, bid_amount: u64) {
        if let Some(contract) = self.contracts.get_mut(&index) {
            contract.process_bid(bidder, bid_amount);
        }
    }
}

impl Contract {
    fn process_bid(&mut self, bidder: String, bid_amount: u64) {
        let bid = Bid { bidder, amount: bid_amount };
        self.bids.push(bid);
    }
}
