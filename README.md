![Screenshot from 2023-07-02 19-01-58](https://github.com/HackArchive/Transpact/assets/81790585/0ff44ded-efc4-4457-9a32-55ea6c8f567e)

## 💡 Inspiration
Are you tired of the challenges and risks associated with managing contracts and funding in traditional business setups? Have you experienced corruption or misuse of funds in your previous contract-based ventures? If so, we have a solution for you!
Introducing our innovative business contract management platform that leverages Web3 technology to offer secure contract creation and transparent monitoring of funded money flow. With our platform, you can have peace of mind knowing that your contracts are secure and funds are being utilized as intended.
The core problem we aim to address is the inefficiency and lack of transparency in contract management and fund allocation. In traditional business models, contracts often involve multiple parties and financial transactions, making it challenging to ensure fair and secure execution. Corruption and misuse of funds can occur due to lack of oversight and accountability.

## ⚙ What it does
- Our platform utilizes the power of the Near blockchain to create smart contracts, which serve as tamper-proof and transparent records of contractual agreements. By leveraging the blockchain, we can ensure the integrity and immutability of contracts, reducing the risks associated with fraud and corruption.
- One of the key features of our platform is the implementation of a multisig wallet between the contractor and the lister. This wallet acts as a secure repository for funds allocated to the contract. Both parties have visibility into the flow of funds, and the lister has the authority to accept or decline fund usage if it appears suspicious. This ensures that the lister maintains control over the funded money and can actively monitor its utilization.
- With our platform, contract participants can enjoy increased trust and transparency in their business dealings. Contractors can have confidence that their work will be compensated appropriately, while listers can have peace of mind knowing that funds will be used responsibly. By combining the security and transparency of blockchain technology with contract management, we aim to revolutionize the way business contracts are created and managed.


## Features and Interfaces

1. Landing Page <a id="Landing Page"></a>
   - ![ArcoLinux_2023-10-21_15-32-16](https://github.com/Transpact/transpact/assets/68425016/dc98e6c9-3ee6-46fa-bd44-e47c3422a13b)


2. Signup Page <a id="Signup-Page"></a>
   - ![ArcoLinux_2023-10-21_15-43-46](https://github.com/Transpact/transpact/assets/68425016/da591af1-72c0-49af-9fe5-df2d42f9b8bd)


3. My Contracts  <a id="My-Contracts"></a>
   - ![ArcoLinux_2023-10-21_15-44-49](https://github.com/Transpact/transpact/assets/68425016/a5469c7f-8f10-4e4d-918e-8c85211de511)


4. Lister Dashboard <a id="Lister-Dashboard"></a>
 - ![ArcoLinux_2023-10-21_15-45-05](https://github.com/Transpact/transpact/assets/68425016/7dc032c8-511f-4591-9300-8b2f78f60584)

5. Create Contract <a id="Create-Contract"></a>
	- ![ArcoLinux_2023-10-21_15-45-25](https://github.com/Transpact/transpact/assets/68425016/c6220668-5012-43f8-a13e-b94b9565770c)


5. Contract View <a id="Contract-View"></a>
	- ![ArcoLinux_2023-10-21_15-45-45](https://github.com/Transpact/transpact/assets/68425016/4cf759f8-5c45-447f-8375-b143606a26b7)


  
6. Contract Flow Completed <a id="Contract-Flow-Completed"></a>
   - ![ArcoLinux_2023-10-21_15-48-26](https://github.com/Transpact/transpact/assets/68425016/05f008b2-0e19-4318-aefe-48300245623f)



## 🛠  How we built it
For building Frontend we use React.js and TailwindCSS for animation. For storing data we use NEAR protocol. For writing Smart Contact we use Rust. Here the contractor registry smart contract implements a contract verification system using the NEAR blockchain platform. It allows for verifying contractors by checking their license numbers with a government database. The system maintains a HashMap to store contractor information, including their license numbers and verification status. When verifying a contractor, the system checks if the contractor is already verified and then validates the license number. If the license number is valid, the contractor is marked as verified and added to the HashMap. If the license number is invalid, an error is thrown.

## 💪Challenges we ran into
- It is our first time building a complete Dapp on NEAR Protocol as well as working with Rust and Smart Contract writing at first we are unable to understand the working on the same. But we are able to do it after reading documentation or searching more about it.

- Thinking about the project as per the perspective of startup is initially hard for us, but after talking to real user we will be able to do that.

It was hard to make a fully responsive and beautiful UI of Transpact. But we are able to do it because of teamwork.

## 📌 Accomplishments that we're proud of
- Well, we built a whole social platform that solves a real world problem in 16 hours!! That's the biggest achievement of this hackathon.
- Able to build the platform on Near protocol that really solves the issue.

## 📚 What we learned
- Learned more about NEAR Protocol and writing the revenue model for the platform . Learned a lot more about Rust, Near protocol and team Building.

## 🛠 What's next for Transpact
Adding some amazing features like :- 
- **Platform Licensing:**     Offer different licensing options for businesses and enterprises to use your contract management platform. Charge a licensing fee based on the number of users, contracts, or specific features included in the license.
 - **Enterprise Integration:** Provide integration services with existing enterprise systems such as CRM, ERP, or project management software. Charge a fee for seamless integration and data synchronization between your platform and their systems.
- **Customization and Consulting:** Offer customization services to tailor your platform to the unique requirements of individual businesses. Provide consulting services to help businesses optimize their contract management processes. 
- **Premium Support:**   Offer enhanced support services such as dedicated account managers, priority assistance, and extended support hours. Charge a subscription fee or premium support package for access to these services.
- **White-label Solutions:**  Provide white-label versions of your contract management platform for businesses to rebrand and offer to their own clients. Charge a licensing fee or revenue share based on the usage or number of clients acquired by the white-label users.
- **Data Security and Compliance:** Highlight the robust security measures and compliance features of your platform. Offer additional security and compliance audits, certifications, or services to businesses that require high levels of data protection. Charge a fee for these security and compliance-focused offerings.
