/**
 * ZSecretEscrow Deployment Script
 * Handles the deployment of contracts and initialization of the application
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const db = require('../services/database');

// Configuration
const CONFIG = {
  initializeDb: true,
  deployZecVault: true,
  deployEscrowIntent: true,
  createTestData: true
};

async function deploy() {
  console.log('Starting ZSecretEscrow deployment...');

  try {
    // Step 1: Ensure environment is set up
    checkEnvironment();

    // Step 2: Initialize the database
    if (CONFIG.initializeDb) {
      console.log('\n--- Initializing Database ---');
      execSync('npm run init-db', { stdio: 'inherit' });
    }

    // Step 3: Deploy ZecVault contract to Base Sepolia
    if (CONFIG.deployZecVault) {
      console.log('\n--- Deploying ZecVault Contract ---');
      execSync('npm run deploy:zecvault', { stdio: 'inherit' });
    }

    // Step 4: Deploy EscrowIntent contract to NEAR testnet
    if (CONFIG.deployEscrowIntent) {
      console.log('\n--- Deploying EscrowIntent Contract ---');
      execSync('npm run deploy:escrow-intent', { stdio: 'inherit' });
    }

    // Step 5: Create test data if requested
    if (CONFIG.createTestData) {
      console.log('\n--- Creating Test Data ---');
      await createTestData();
    }

    console.log('\n🎉 Deployment completed successfully!');
    console.log('\nTo start the application, run:');
    console.log('  npm start');
    console.log('\nTo start just the API server, run:');
    console.log('  npm run start:api');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

function checkEnvironment() {
  console.log('Checking environment...');
  
  // Check if .env file exists
  if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
    console.error('Error: .env file not found. Please create one from .env.example');
    process.exit(1);
  }
  
  // Check required environment variables
  const requiredVars = [
    'BASE_SEPOLIA_RPC_URL',
    'PRIVATE_KEY',
    'NEAR_ACCOUNT_ID',
    'NEAR_PRIVATE_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please update your .env file with these values.');
    process.exit(1);
  }
  
  console.log('Environment check passed ✅');
}

async function createTestData() {
  try {
    // Initialize the database
    await db.initialize();
    
    // Create test users (if they don't exist)
    console.log('Creating test users...');
    
    // Add test users to the database
    const now = Date.now();
    
    // Example SQL to add test users - in a real script you'd use db methods
    await db.dbRun(`
      INSERT OR IGNORE INTO users (
        user_id, username, email, password_hash, role, created_at, updated_at
      ) VALUES 
        ('testclient', 'testclient', 'client@example.com', 'pass123', 'client', ?, ?),
        ('testfreelancer', 'testfreelancer', 'freelancer@example.com', 'pass123', 'freelancer', ?, ?)
    `, [now, now, now, now]);
    
    console.log('Test data created successfully ✅');
    
    // Close the database connection
    await db.close();
    
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
}

// Run the deploy function if the script is executed directly
if (require.main === module) {
  deploy().catch(error => {
    console.error('Unhandled error in deployment script:', error);
    process.exit(1);
  });
}

module.exports = { deploy }; 