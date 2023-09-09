const near = require('near-api-js');

const keyStore = new near.keyStores.InMemoryKeyStore();
const nearConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

const nearAPI = near.connect({ ...nearConfig, deps: { keyStore } });

const accountId = '';
const contractName = '';

async function sendTransaction() {
  try {
    const keyPair = near.KeyPair.fromString('my_secret_private_key');
    await keyStore.setKey(nearConfig.networkId, accountId, keyPair);
    const account = new near.Account(nearAPI.connection, accountId);

    const transaction = nearAPI.transactions.new(accountId, near.transactions.FunctionCall(
      contractName,
      'get_your_contracts',
      { },
      nearAPI.utils.format.parseNearAmount('0.1') 
    ));

    await account.signAndSendTransaction(transaction);
    console.log('Transaction sent successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

sendTransaction();