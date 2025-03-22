/**
 * EscrowIntent Deployment Script
 * 
 * This script handles deployment of the EscrowIntent contract to NEAR testnet
 * You need to set NEAR account ID and private key in environment variables
 */

const nearAPI = require('near-api-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Environment variables
const NEAR_NETWORK = process.env.NEAR_NETWORK || 'testnet';
const ACCOUNT_ID = process.env.NEAR_ACCOUNT_ID;
const PRIVATE_KEY = process.env.NEAR_PRIVATE_KEY;
const CONTRACT_NAME = process.env.NEAR_CONTRACT_NAME || `escrow-intent-${Date.now()}.${ACCOUNT_ID}`;

// Paths
const WASM_PATH = path.join(__dirname, '../../out/escrow_intent.wasm');

/**
 * Deploy the EscrowIntent contract to NEAR testnet
 */
async function deployEscrowIntent() {
  if (!ACCOUNT_ID) {
    console.error('Error: NEAR account ID not found. Set it in the NEAR_ACCOUNT_ID environment variable.');
    process.exit(1);
  }

  if (!PRIVATE_KEY) {
    console.error('Error: NEAR private key not found. Set it in the NEAR_PRIVATE_KEY environment variable.');
    process.exit(1);
  }

  console.log(`Deploying EscrowIntent contract to NEAR ${NEAR_NETWORK}...`);

  try {
    // Read WASM file
    let wasmFileBuffer;
    try {
      wasmFileBuffer = fs.readFileSync(WASM_PATH);
    } catch (error) {
      console.error('Error reading WASM file:', error.message);
      console.log('Make sure you have built the contract with: cargo build --target wasm32-unknown-unknown --release');
      process.exit(1);
    }

    // Configure NEAR connection
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
    const keyPair = nearAPI.KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey(NEAR_NETWORK, ACCOUNT_ID, keyPair);

    const nearConfig = {
      networkId: NEAR_NETWORK,
      keyStore,
      nodeUrl: `https://rpc.${NEAR_NETWORK}.near.org`,
      walletUrl: `https://wallet.${NEAR_NETWORK}.near.org`,
      helperUrl: `https://helper.${NEAR_NETWORK}.near.org`,
      explorerUrl: `https://explorer.${NEAR_NETWORK}.near.org`,
    };

    // Connect to NEAR
    const near = await nearAPI.connect(nearConfig);
    const account = await near.account(ACCOUNT_ID);

    console.log(`Deploying from account: ${ACCOUNT_ID}`);
    console.log(`Contract will be deployed at: ${CONTRACT_NAME}`);

    // Check account balance
    const balance = await account.getAccountBalance();
    console.log(`Account balance: ${nearAPI.utils.format.formatNearAmount(balance.available)} NEAR`);

    // Create contract account if it doesn't exist
    try {
      console.log('Creating contract account...');
      await account.createAccount(
        CONTRACT_NAME,
        keyPair.getPublicKey(),
        nearAPI.utils.format.parseNearAmount('5') // Initial balance for the contract account
      );
      console.log('Contract account created successfully');
    } catch (error) {
      console.log('Contract account already exists or could not be created:', error.message);
      // Continue anyway as the account might already exist
    }

    // Deploy contract
    console.log('Deploying contract...');
    try {
      const contractAccount = await near.account(CONTRACT_NAME);
      const deployResult = await contractAccount.deployContract(wasmFileBuffer);
      
      console.log('Contract deployed successfully!');
      
      // Initialize the contract
      console.log('Initializing contract...');
      await contractAccount.functionCall({
        contractId: CONTRACT_NAME,
        methodName: 'new',
        args: { owner_id: ACCOUNT_ID },
        gas: '300000000000000',
      });
      
      console.log('Contract initialized with owner:', ACCOUNT_ID);
      
      // Save deployment info
      const deploymentInfo = {
        network: NEAR_NETWORK,
        contractName: CONTRACT_NAME,
        deployedBy: ACCOUNT_ID,
        deploymentTime: new Date().toISOString(),
        transactionHash: deployResult.transaction.hash,
      };

      const deploymentPath = path.join(__dirname, '../../deployments');
      if (!fs.existsSync(deploymentPath)) {
        fs.mkdirSync(deploymentPath, { recursive: true });
      }

      fs.writeFileSync(
        path.join(deploymentPath, 'escrow-intent-deployment.json'),
        JSON.stringify(deploymentInfo, null, 2)
      );
      
      console.log('Deployment information saved to deployments/escrow-intent-deployment.json');
      
      return deploymentInfo;
    } catch (error) {
      console.error('Error deploying or initializing contract:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Deployment error:', error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  deployEscrowIntent()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { deployEscrowIntent }; 