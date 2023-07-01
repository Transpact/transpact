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

  // DUMMY IMPLEMENTATION: Checks the validity of a license no.
  fn check_license_validity(&self, license_number: &str) -> bool {
    //simple check that returns true if the license number matches a predefined valid license number
    let valid_license_number = "VALID_LICENSE_NUMBER";
    license_number == valid_license_number
}
}