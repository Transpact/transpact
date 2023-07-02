use near_sdk::{env, near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}, collections::LookupMap};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Bid {
    pub contractor_id: String,
    pub amount: u64,
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct BiddingContract {
    bids: Vec<Bid>,
}

#[near_bindgen]
impl BiddingContract {
    /// Submit a bid for a contract.
    pub fn submit_bid(&mut self, contractor_id: String, amount: u64) {
        let bid = Bid {
            contractor_id,
            amount,
        };
        self.bids.push(bid);
    }

    /// Get the total number of bids.
    pub fn get_total_bids(&self) -> u64 {
        self.bids.len() as u64
    }

    /// Get the details of a specific bid by its index.
    pub fn get_bid_details(&self, index: u64) -> Option<Bid> {
        self.bids.get(index as usize).cloned()
    }

    /// Select the winning bid based on the highest amount.
    pub fn select_winning_bid(&self) -> Option<Bid> {
        // Logic to select the winning bid, such as comparing the amounts and choosing the highest bid
        self.bids.iter().max_by_key(|bid| bid.amount).cloned()
    }
}
