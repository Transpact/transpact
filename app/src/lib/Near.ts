const { Contract, Account, Connection,connect,keyStores, KeyPair } = require('near-api-js');
import { env } from "@/env.mjs";

const accountId = env.ACCOUNT_ID;
// const contractName = env.CONTRACT_ADDRESS;
const private_key = env.WALLET_PRIVATE_KEY;


const contractDef = {
  viewMethods: ['get_contract','check_hash'],
  changeMethods: ["create_contract"],
}


export async function AccountSetup() {
  
  const contractName = "dev-1695289713998-62725920744725";
    try{
        
        const myKeyStore = new keyStores.InMemoryKeyStore(); 
        await myKeyStore.setKey("testnet","atmegabuzz.testnet",KeyPair.fromString(private_key))
      
        const connectionConfig = {
          networkId: "testnet",
          keyStore: myKeyStore, // first create a key store 
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
        
      
        const connection = await connect(connectionConfig);
        const account = await connection.account(accountId);
                
        const contract = new Contract(
          account,
          contractName,
          contractDef
        )

        return [ account, contract ]

    } catch (e:any){
        console.log("Near account error",e);
        return [ null , null ];
    }
  
}


// export const {account, contract} = AccountSetup();

// await account.sendMoney(
    //   "dev-1694972170706-75161509436407",
//   "1000000000000000000000000"
//   )


//   const resp1 = await contract.change_name(
//     {
//       name: "sandesh",
//     }
//   )

//   const resp = await contract.get_name()