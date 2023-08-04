use near_sdk::{env, near_bindgen, collections::LookupMap, BorshStorageKey};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct User {
    pub wallet_id: String,
    pub role: String,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, BorshStorageKey)]
pub struct Contract {
    users: LookupMap<String, User>,
}

impl Default for Contract {
    fn default() -> Self {
        env::panic(b"The contract is not initialized. Please initialize it before usage.")
    }
}

#[near_bindgen]
impl Contract {
    /// Logs in a user and assigns their role based on wallet ID.
    pub fn login(&self, wallet_id: String) -> Option<String> {
        if let Some(user) = self.users.get(&wallet_id) {
            Some(user.role.clone())
        } else {
            None
        }
    }

    /// sets role based on  wallet ID.
    pub fn set_role(&mut self, wallet_id: String, role: String) {
        let user = User {
            wallet_id: wallet_id.clone(),
            role: role.clone(),
        };
        self.users.insert(&wallet_id, &user);
    }
}
