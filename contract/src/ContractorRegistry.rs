use near_sdk::{env, near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}, collections::HashMap};

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct ContractorVerification {
    contractors: HashMap<String, ContractorInfo>,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct ContractorInfo {
    license_number: String,
    verified: bool,
}

#[near_bindgen]
impl ContractorVerification {
    // Verifies a contractor by checking their license number with the gov DB
    pub fn verify_contractor(&mut self, contractor_id: String, license_number: String) {
        if self.contractors.contains_key(&contractor_id) {
            env::panic(b"The contractor is already verified.");
        }

        // Verify the license number by checking with the government DB
        let is_license_valid = self.check_license_validity(&license_number);
        
        if is_license_valid {
            let contractor = ContractorInfo {
                license_number,
                verified: true,
            };
            self.contractors.insert(&contractor_id, &contractor);
        } else {
            env::panic(b"The license number is invalid.");
        }
    }

    // Checks if a contractor with the given ID is verified.
    pub fn is_contractor_verified(&self, contractor_id: String) -> bool {
        if let Some(contractor) = self.contractors.get(&contractor_id) {
            return contractor.verified;
        }
        false
    }

    // DUMMY IMPLEMENTATION: Checks the validity of a license number (not real implementation)
    fn check_license_validity(&self, license_number: &str) -> bool {
        // logic for license number verification with the government DB
        license_number == "VALID_LICENSE_NUMBER"
    }
}
