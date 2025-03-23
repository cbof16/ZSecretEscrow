require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connect, keyStores, KeyPair } = require('near-api-js');
const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.API_PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/zescrow.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// NEAR connection configuration
const nearConfig = {
  networkId: process.env.NEAR_NETWORK || 'testnet',
  nodeUrl: process.env.NEAR_NODE_URL || 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
  keyStore: new keyStores.InMemoryKeyStore()
};

// Base Sepolia configuration
const baseSepolia = {
  rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  zecVaultAddress: process.env.ZECVAULT_ADDRESS
};

// Setup NEAR and Ethereum connections
let nearConnection;
let nearAccountId;
let ethProvider;
let zecVaultContract;

// Load contract ABIs
const zecVaultAbi = [
  // Basic ABI for ZecVault - Replace with actual ABI in production
  "function createEscrow(string memory intentId, address client, address freelancer, uint256 amount) external returns (uint256)",
  "function releaseEscrow(uint256 escrowId) external",
  "function refundEscrow(uint256 escrowId) external",
  "function getEscrow(uint256 escrowId) external view returns (address, address, uint256, uint8)"
];

// Initialize blockchain connections
async function initBlockchainConnections() {
  try {
    // Initialize NEAR connection
    nearAccountId = process.env.NEAR_ACCOUNT_ID;
    const nearPrivateKey = process.env.NEAR_PRIVATE_KEY;
    
    if (!nearAccountId || !nearPrivateKey) {
      console.error('NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY must be set in .env file');
      process.exit(1);
    }
    
    const keyPair = KeyPair.fromString(nearPrivateKey);
    await nearConfig.keyStore.setKey(nearConfig.networkId, nearAccountId, keyPair);
    
    nearConnection = await connect(nearConfig);
    console.log(`Connected to NEAR ${nearConfig.networkId} with account: ${nearAccountId}`);

    // Initialize Ethereum connection
    const ethPrivateKey = process.env.PRIVATE_KEY;
    
    if (!ethPrivateKey || !baseSepolia.zecVaultAddress) {
      console.error('PRIVATE_KEY and ZECVAULT_ADDRESS must be set in .env file');
      process.exit(1);
    }
    
    ethProvider = new ethers.JsonRpcProvider(baseSepolia.rpcUrl);
    const wallet = new ethers.Wallet(ethPrivateKey, ethProvider);
    zecVaultContract = new ethers.Contract(baseSepolia.zecVaultAddress, zecVaultAbi, wallet);
    
    console.log(`Connected to Base Sepolia at ${baseSepolia.rpcUrl}`);
    console.log(`ZecVault contract initialized at ${baseSepolia.zecVaultAddress}`);
  } catch (error) {
    console.error('Error initializing blockchain connections:', error);
    process.exit(1);
  }
}

// Utility functions for database operations
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Zcash wallet interactions
// Note: In a production environment, integrate with a secure Zcash wallet service
const zcashService = {
  generateWallet: async (userId) => {
    // This is a placeholder - in production, integrate with a secure Zcash wallet service
    const mockWalletAddress = `zs1${Math.random().toString(36).substring(2, 15)}`;
    
    try {
      const result = await dbAsync.run(
        'INSERT INTO wallets (user_id, address, blockchain, created_at) VALUES (?, ?, ?, ?)',
        [userId, mockWalletAddress, 'zcash', new Date().toISOString()]
      );
      
      return {
        id: result.lastID,
        userId,
        address: mockWalletAddress,
        blockchain: 'zcash'
      };
    } catch (error) {
      console.error('Error creating Zcash wallet:', error);
      throw error;
    }
  },
  
  getWallet: async (userId) => {
    try {
      const wallet = await dbAsync.get(
        'SELECT * FROM wallets WHERE user_id = ? AND blockchain = ?',
        [userId, 'zcash']
      );
      
      return wallet;
    } catch (error) {
      console.error('Error getting Zcash wallet:', error);
      throw error;
    }
  }
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// ==================
// Wallet Endpoints
// ==================

// Create a new wallet
app.post('/api/wallets', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const wallet = await zcashService.generateWallet(userId);
    res.status(201).json(wallet);
  } catch (error) {
    console.error('Error creating wallet:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Get wallet information
app.get('/api/wallets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await zcashService.getWallet(userId);
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    
    res.json(wallet);
  } catch (error) {
    console.error('Error getting wallet:', error);
    res.status(500).json({ error: 'Failed to get wallet information' });
  }
});

// ==================
// Deals Endpoints
// ==================

// Create a new deal
app.post('/api/deals', async (req, res) => {
  try {
    const { clientId, freelancerId, title, description, amount } = req.body;
    
    if (!clientId || !freelancerId || !title || !amount) {
      return res.status(400).json({ error: 'clientId, freelancerId, title, and amount are required' });
    }
    
    // Create escrow intent on NEAR
    const account = await nearConnection.account(nearAccountId);
    const intentId = `intent_${Date.now()}`;
    
    const nearResult = await account.functionCall({
      contractId: process.env.ESCROW_INTENT_ID || nearAccountId,
      methodName: 'create_escrow',
      args: {
        client_id: clientId,
        freelancer_id: freelancerId,
        escrow_id: intentId
      },
      gas: '30000000000000' // 30 TGas
    });
    
    // Store deal in database
    const result = await dbAsync.run(
      'INSERT INTO deals (client_id, freelancer_id, title, description, amount, intent_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [clientId, freelancerId, title, description, amount, intentId, 'created', new Date().toISOString()]
    );
    
    const dealId = result.lastID;
    
    res.status(201).json({
      id: dealId,
      clientId,
      freelancerId,
      title,
      description,
      amount,
      intentId,
      status: 'created',
      transactionHash: nearResult.transaction.hash
    });
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Get deal information
app.get('/api/deals/:dealId', async (req, res) => {
  try {
    const { dealId } = req.params;
    const deal = await dbAsync.get('SELECT * FROM deals WHERE id = ?', [dealId]);
    
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    res.json(deal);
  } catch (error) {
    console.error('Error getting deal:', error);
    res.status(500).json({ error: 'Failed to get deal information' });
  }
});

// Get all deals for a user
app.get('/api/users/:userId/deals', async (req, res) => {
  try {
    const { userId } = req.params;
    const deals = await dbAsync.all(
      'SELECT * FROM deals WHERE client_id = ? OR freelancer_id = ? ORDER BY created_at DESC',
      [userId, userId]
    );
    
    res.json(deals);
  } catch (error) {
    console.error('Error getting user deals:', error);
    res.status(500).json({ error: 'Failed to get user deals' });
  }
});

// ==================
// Work Submission/Approval Endpoints
// ==================

// Submit work for review
app.post('/api/deals/:dealId/submit', async (req, res) => {
  try {
    const { dealId } = req.params;
    const { workUrl, comments } = req.body;
    
    if (!workUrl) {
      return res.status(400).json({ error: 'workUrl is required' });
    }
    
    // Get deal information
    const deal = await dbAsync.get('SELECT * FROM deals WHERE id = ?', [dealId]);
    
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    if (deal.status !== 'created' && deal.status !== 'disputed') {
      return res.status(400).json({ error: `Cannot submit work for a deal with status: ${deal.status}` });
    }
    
    // Update deal status
    await dbAsync.run(
      'UPDATE deals SET status = ?, work_url = ?, submission_comments = ?, updated_at = ? WHERE id = ?',
      ['submitted', workUrl, comments, new Date().toISOString(), dealId]
    );
    
    // Call NEAR contract to update intent status
    const account = await nearConnection.account(nearAccountId);
    await account.functionCall({
      contractId: process.env.ESCROW_INTENT_ID || nearAccountId,
      methodName: 'update_escrow_status',
      args: {
        escrow_id: deal.intent_id,
        status: 'submitted'
      },
      gas: '30000000000000' // 30 TGas
    });
    
    res.json({
      dealId,
      status: 'submitted',
      workUrl,
      comments,
      message: 'Work submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting work:', error);
    res.status(500).json({ error: 'Failed to submit work' });
  }
});

// Approve submitted work
app.post('/api/deals/:dealId/approve', async (req, res) => {
  try {
    const { dealId } = req.params;
    const { reviewComments } = req.body;
    
    // Get deal information
    const deal = await dbAsync.get('SELECT * FROM deals WHERE id = ?', [dealId]);
    
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    if (deal.status !== 'submitted') {
      return res.status(400).json({ error: 'Can only approve deals with submitted work' });
    }
    
    // Update deal status
    await dbAsync.run(
      'UPDATE deals SET status = ?, review_comments = ?, updated_at = ? WHERE id = ?',
      ['approved', reviewComments, new Date().toISOString(), dealId]
    );
    
    // Call NEAR contract to release funds
    const account = await nearConnection.account(nearAccountId);
    const nearResult = await account.functionCall({
      contractId: process.env.ESCROW_INTENT_ID || nearAccountId,
      methodName: 'release_escrow',
      args: {
        escrow_id: deal.intent_id
      },
      gas: '30000000000000' // 30 TGas
    });
    
    // Call ZecVault contract to release funds
    if (deal.eth_escrow_id) {
      const ethResult = await zecVaultContract.releaseEscrow(deal.eth_escrow_id);
      await ethResult.wait();
    }
    
    res.json({
      dealId,
      status: 'approved',
      reviewComments,
      message: 'Work approved and funds released',
      transaction: nearResult.transaction.hash
    });
  } catch (error) {
    console.error('Error approving work:', error);
    res.status(500).json({ error: 'Failed to approve work' });
  }
});

// Dispute submitted work
app.post('/api/deals/:dealId/dispute', async (req, res) => {
  try {
    const { dealId } = req.params;
    const { disputeReason } = req.body;
    
    if (!disputeReason) {
      return res.status(400).json({ error: 'disputeReason is required' });
    }
    
    // Get deal information
    const deal = await dbAsync.get('SELECT * FROM deals WHERE id = ?', [dealId]);
    
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    if (deal.status !== 'submitted') {
      return res.status(400).json({ error: 'Can only dispute deals with submitted work' });
    }
    
    // Update deal status
    await dbAsync.run(
      'UPDATE deals SET status = ?, dispute_reason = ?, updated_at = ? WHERE id = ?',
      ['disputed', disputeReason, new Date().toISOString(), dealId]
    );
    
    // Call NEAR contract to update intent status
    const account = await nearConnection.account(nearAccountId);
    const nearResult = await account.functionCall({
      contractId: process.env.ESCROW_INTENT_ID || nearAccountId,
      methodName: 'update_escrow_status',
      args: {
        escrow_id: deal.intent_id,
        status: 'disputed'
      },
      gas: '30000000000000' // 30 TGas
    });
    
    res.json({
      dealId,
      status: 'disputed',
      disputeReason,
      message: 'Work disputed successfully',
      transaction: nearResult.transaction.hash
    });
  } catch (error) {
    console.error('Error disputing work:', error);
    res.status(500).json({ error: 'Failed to dispute work' });
  }
});

// ==================
// Counter Endpoints (from previous implementation)
// ==================

// Get counter value
app.get('/api/counter', async (req, res) => {
  try {
    const account = await nearConnection.account(nearAccountId);
    const result = await account.viewFunction({
      contractId: nearAccountId,
      methodName: 'get_count',
      args: {}
    });
    
    res.json({ count: result });
  } catch (error) {
    console.error('Error getting counter:', error);
    res.status(500).json({ error: 'Failed to get counter value' });
  }
});

// Increment counter
app.post('/api/counter/increment', async (req, res) => {
  try {
    const account = await nearConnection.account(nearAccountId);
    const result = await account.functionCall({
      contractId: nearAccountId,
      methodName: 'increment',
      args: {},
      gas: '30000000000000' // 30 TGas
    });
    
    res.json({ 
      success: true, 
      transactionHash: result.transaction.hash,
      newCount: 'Check counter endpoint for updated value'
    });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    res.status(500).json({ error: 'Failed to increment counter' });
  }
});

// Starting the server
async function startServer() {
  try {
    await initBlockchainConnections();
    
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
      console.log(`Try the health endpoint: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error); 