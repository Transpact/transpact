const { Contract, Account, Connection,connect,keyStores, KeyPair } = require('near-api-js');

const accountId = 'atmegabuzz.testnet';
const contractName = 'dev-1694972170706-75161509436407';

const data = {
  public_key:"ed25519:5bQPYAyVTSmBCiXyaLKTwzmj7U54B7zoJqsssxkwDsSi",
  private_key:"ed25519:2cPoeYoHjA43YNWGNTP8tNkJy1UwL1ipBQNbBVaLG6C8jKGWFKxwLa7KaYqPK8Fqw2uKeTgKLyBRVqa4WSrdGGE8"
}

const contractDef = {
    viewMethods: ['get_name'],
    changeMethods: ["change_name"],
}


async function AccountSetup(){
  
  const myKeyStore = new keyStores.InMemoryKeyStore(); 
  await myKeyStore.setKey("testnet","atmegabuzz.testnet",KeyPair.fromString(data.private_key))

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

  
  return {account,contract}
  
}

export const {account, contract} = AccountSetup();

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