# Software Workflow Documentation - Contract Managing Website

## Connect Wallet Page
- This page serves as the entry point to the application.
- Users can connect their wallet on this page.
- An API call will be made to the smart contract or backend to verify the user's existence and determine their user type (Lister/Bidder).
- If the user doesn't exist, they will be redirected to the Signup User page.
- If the user is a Lister, they will be redirected to the Lister dashboard.
- If the user is a Bidder, they will be redirected to the Bidder dashboard.

## Signup User Page
- This page allows users to register as a Bidder or Lister.
- Sign Up as Lister/Contract Lister:
  - Name of the Lister
  - Industry Type (Dropdown)
  - Submit Verification Document (Driving License)
  - License Number
  - License Image
  - After completing the form, an API call will be made to register the user as a Lister/Contract Lister in the platform.
- Sign Up as Bidder/Contractor:
  - Name of the Bidder
  - Industry Type (Dropdown)
  - Submit Verification Document (Driving License)
  - License Number
  - License Image
  - After completing the form, an API call will be made to register the user as a Bidder/Contractor in the platform.
  
## Contract Lister Section
### Contract Lister Dashboard
- Analytics:
  - Total Contract Listers / Pending Contracts / Completed Contracts
  - Total Amount Spent on Pending and Completed contracts
- List Contract View (Dropdown Filter: Pending/Completed/All):
  - Clicking on a contract card will navigate to the Contract Detail View.
  - Contract card displays information such as Contract name, start date, end date, amount, and Contract status: Listed/Pending/Completed.
- Create Contract Button:
  - Clicking on this button will navigate to the Create Contract page.
  
## Create Contract Page
- This page allows Contract Listers to create a new contract by providing the necessary contract information.
- Contract Info:
  - Contract Name
  - Contract Description (in Markdown)
  - Amount in USD
  - Contract Industry Type (e.g., Infrastructure/Construction/...)
  - Execution Location: Country, State / Remote
  - Target Location: Country, State / Remote
  - Depending on the location, the contract will be listed to contractors in that location or globally with the same Industry Type as the lister's contract.
  
## View Contract Page (For Contract Lister)
### If Contract Status == Listed
- Contract Detail Section: Displays the same info provided during contract creation.
- List Bidders Section (Card) -> Bidders Counter Requirements page:
  - Displays the bidders' names, counter amounts, counter start and end dates.
  - Accept Bidder / Decline Bidder Button.
### If Contract Status == Pending
- Contract Detail Section: Displays the same info provided during contract creation.
- Accepted Bidders Info Card:
  - Lists the requirements and costing of each requirement provided by the bidder.
  - MultiSig wallet setup with Lister and Bidder addresses.
  - Lister can add funds to the wallet, and the Bidder can withdraw funds if the Lister accepts the withdrawal.
  - Lister can mark requirements as completed, reflecting progress in the Contract Progress Bar.
### If Contract Status == Completed
- Contract Detail Section: Displays the same info provided during contract creation.
- Listed Amount: Amount when the contract was listed.
- Completed Amount: Amount used when the contract was completed.
- Displays completed requirements and uncompleted requirements.
  
## Contract Lister Profile
- This section is visible to all users on the platform.
- Displays Contract Lister's stats, reviews of contractors, and other relevant information.

## Contract Bidder Section
### Contractor Dashboard
- Contractor Analytics and Stats:
  - Total Completed Contracts / Pending Contracts
  - Contract Completed Amount relative to Listed Amount
- List Contracts View (Dropdown Filter: Listed/Ongoing):
  - Clicking on a contract card will navigate to the Contract Detail View.
  - Contract card displays information such as Contract Title, Listed Amount, Industry Type, Start Date, and End Date.
  
## View Contract Page (For Contractor/Bidder)
### If Contract == Listed
- Bidders can bid on the contract by clicking on the BID button.
- Bidders will be asked to provide information and create a proposal regarding how they can solve the problem.
- Bidders can specify the counter amount, counter start and end dates, and list requirements/deliverables/tasks.
### If Contract == Ongoing/Pending
- This page shows the contract details when the contractor has been selected for the contract.
- Contract Detail Section displays the same info provided during contract creation.
- Listed Amount will be changed to the Counter Amount.
- Listed Date will be changed to the Counter Start and End Dates.
- List Requirements/Deliverables/Tasks will be shown, and the lister can mark them as completed.
- Funds can be transferred from the wallet.
  
## Contractor Profile
- This section is visible to all users on the platform.
- Displays the contractor's public info, completed contracts, contract ratings left by listers, and completion rate.
