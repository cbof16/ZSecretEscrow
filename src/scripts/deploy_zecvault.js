/**
 * ZecVault Deployment Script
 * 
 * This script deploys the ZecVault contract to Base Sepolia testnet
 * You need to set the RPC URL and private key in environment variables
 * or directly in this file (not recommended for production).
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Path to the compiled contract
const CONTRACT_PATH = path.join(__dirname, '../../out/ZecVault.sol/ZecVault.json');

// Environment variables
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Deploy function
async function deployZecVault() {
  if (!PRIVATE_KEY) {
    console.error('Error: Private key not found. Set it in the PRIVATE_KEY environment variable.');
    process.exit(1);
  }

  console.log('Deploying ZecVault contract to Base Sepolia...');

  try {
    // Load contract ABI and bytecode
    let contractJson;
    try {
      contractJson = JSON.parse(fs.readFileSync(CONTRACT_PATH, 'utf8'));
    } catch (error) {
      console.error('Error reading contract JSON:', error.message);
      console.log('Make sure you have compiled the contract with Foundry: `forge build`');
      process.exit(1);
    }

    const abi = contractJson.abi;
    const bytecode = contractJson.bytecode.object;

    // Setup provider and wallet - updated for ethers v6
    const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const walletAddress = await wallet.getAddress();

    console.log(`Deploying from address: ${walletAddress}`);

    // Check wallet balance
    const balance = await provider.getBalance(walletAddress);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);

    if (balance < ethers.parseEther('0.01')) {
      console.warn('Warning: Low balance. You might need more ETH to deploy.');
    }

    // Deploy contract - updated for ethers v6
    const ContractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await ContractFactory.deploy();
    
    console.log(`Transaction hash: ${contract.deploymentTransaction().hash}`);
    console.log('Waiting for contract deployment...');
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    console.log('ZecVault contract deployed successfully!');
    console.log(`Contract address: ${contractAddress}`);

    // Save deployment info to a file
    const deploymentInfo = {
      network: 'base-sepolia',
      contractAddress: contractAddress,
      deployedBy: walletAddress,
      deploymentTime: new Date().toISOString(),
      transactionHash: contract.deploymentTransaction().hash
    };

    const deploymentPath = path.join(__dirname, '../../deployments');
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(deploymentPath, 'zecvault-deployment.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('Deployment information saved to deployments/zecvault-deployment.json');
    
    return deploymentInfo;
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  deployZecVault()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { deployZecVault }; 