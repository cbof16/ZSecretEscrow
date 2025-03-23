/**
 * Simple NEAR contract deployment script
 */
const fs = require('fs');
const path = require('path');
const { connect, keyStores, KeyPair, utils } = require('near-api-js');

// Load environment variables
require('dotenv').config();

async function deployContract() {
  try {
    // Read WASM file
    const WASM_PATH = path.join(__dirname, '../../build/near/counter.wasm');
    const wasmData = fs.readFileSync(WASM_PATH);
    console.log(`WASM file size: ${wasmData.length} bytes`);

    // Configure NEAR connection
    const ACCOUNT_ID = process.env.NEAR_ACCOUNT_ID;
    const PRIVATE_KEY = process.env.NEAR_PRIVATE_KEY;
    const NETWORK = 'testnet';

    if (!ACCOUNT_ID || !PRIVATE_KEY) {
      console.error('Please set NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY in your environment');
      process.exit(1);
    }

    // Set up the keystore
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey(NETWORK, ACCOUNT_ID, keyPair);

    // Connect to NEAR
    const config = {
      networkId: NETWORK,
      keyStore,
      nodeUrl: `https://rpc.${NETWORK}.near.org`,
      walletUrl: `https://wallet.${NETWORK}.near.org`,
      helperUrl: `https://helper.${NETWORK}.near.org`,
      explorerUrl: `https://explorer.${NETWORK}.near.org`,
    };

    console.log(`Connecting to NEAR ${NETWORK}...`);
    const near = await connect(config);
    const account = await near.account(ACCOUNT_ID);

    // Check account balance
    const balance = await account.getAccountBalance();
    console.log(`Account balance: ${utils.format.formatNearAmount(balance.available)} NEAR`);

    // Deploy the contract
    console.log(`Deploying contract to ${ACCOUNT_ID}...`);
    const result = await account.deployContract(wasmData);
    console.log('Contract deployment transaction:', result.transaction.hash);
    console.log('Contract deployed successfully!');

    // Initialize the contract in a separate transaction
    console.log('Initializing the counter contract...');
    try {
      const initResult = await account.functionCall({
        contractId: ACCOUNT_ID,
        methodName: 'new',
        args: { initial_count: 0 },
        gas: '300000000000000',
        attachedDeposit: '0'
      });
      console.log('Contract initialized successfully!');
      console.log('Transaction hash:', initResult.transaction.hash);
    } catch (initError) {
      console.error('Error initializing contract:', initError);
    }

  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

// Run the deployment
deployContract(); 