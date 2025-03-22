/**
 * Escrow Integration Service
 * 
 * This service coordinates between Zcash, ZecVault on Base Sepolia, and EscrowIntent on NEAR
 * to provide a complete escrow solution.
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const db = require('./database');
const zcashService = require('./zcash_service');
const nearService = require('./near_service');
const zcashMonitor = require('./zcash_monitor');

// Load environment variables
require('dotenv').config();

// ZecVault contract ABI and address
const ZEC_VAULT_ABI = require('../contracts/evm/ZecVault.json').abi;
const ZEC_VAULT_ADDRESS = process.env.ZEC_VAULT_ADDRESS || '0x1234567890123456789012345678901234567890';

class EscrowService {
  constructor() {
    this.initialized = false;
    this.provider = null;
    this.wallet = null;
    this.contract = null;
  }

  /**
   * Initialize all services and contracts
   */
  async initialize() {
    try {
      console.log('Initializing Escrow Service...');
      
      // Initialize database
      await db.initialize();
      
      // Initialize Zcash Service
      const zcashInitialized = await zcashService.initialize();
      if (!zcashInitialized) {
        throw new Error('Failed to initialize Zcash Service');
      }
      
      // Initialize NEAR Service
      const nearInitialized = await nearService.initialize();
      if (!nearInitialized) {
        throw new Error('Failed to initialize NEAR Service');
      }
      
      // Initialize ZecVault Monitor
      await this.setupEthereumContract();
      
      // Initialize Zcash Monitor
      await zcashMonitor.initialize(this);
      
      this.initialized = true;
      console.log('Escrow Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Escrow Service:', error);
      return false;
    }
  }

  /**
   * Set up Ethereum provider, wallet, and contract
   */
  async setupEthereumContract() {
    try {
      // Setup Ethereum connection
      const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Set up wallet if private key is available
      if (process.env.PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.contract = new ethers.Contract(ZEC_VAULT_ADDRESS, ZEC_VAULT_ABI, this.wallet);
        console.log('Connected to ZecVault contract as owner');
      } else {
        // Read-only connection
        this.contract = new ethers.Contract(ZEC_VAULT_ADDRESS, ZEC_VAULT_ABI, this.provider);
        console.log('Connected to ZecVault contract in read-only mode');
      }
      
      return true;
    } catch (error) {
      console.error('Error setting up Ethereum contract:', error);
      return false;
    }
  }

  /**
   * Start all monitoring services
   */
  async startServices() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Start Zcash sync
    await zcashService.startSync();
    
    // Start Zcash monitor
    await zcashMonitor.startMonitoring();
    
    console.log('All services started');
    return true;
  }

  /**
   * Stop all monitoring services
   */
  async stopServices() {
    await zcashService.stopSync();
    await zcashMonitor.stopMonitoring();
    console.log('All services stopped');
    return true;
  }

  /**
   * Create a wallet for a user
   */
  async createUserWallet(userId, label = '') {
    try {
      // Check if user already has a wallet
      const existingWallet = await db.getWallet(userId);
      if (existingWallet) {
        return existingWallet;
      }
      
      // Create new wallet
      const wallet = await zcashService.createWallet(userId, label);
      
      // Store wallet in database with user ID
      wallet.userId = userId;
      await db.storeWallet(wallet);
      
      return wallet;
    } catch (error) {
      console.error(`Error creating wallet for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Import a wallet for a user
   */
  async importUserWallet(userId, seedPhrase, label = '') {
    try {
      // Import wallet
      const wallet = await zcashService.importWallet(userId, seedPhrase, label);
      
      // Store wallet in database with user ID
      wallet.userId = userId;
      await db.storeWallet(wallet);
      
      return wallet;
    } catch (error) {
      console.error(`Error importing wallet for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if user has sufficient balance for a transaction
   */
  async checkSufficientBalance(userId, amountZec) {
    try {
      const wallet = await zcashService.getWallet(userId);
      if (!wallet) {
        return false;
      }
      
      // Convert ZEC to zatoshi for comparison
      const amountZatoshi = Math.floor(amountZec * 100000000);
      return wallet.balance.total >= amountZatoshi;
    } catch (error) {
      console.error(`Error checking balance for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Create a new deal
   */
  async createDeal(clientId, freelancerId, amountZec, deadlineDays, description) {
    try {
      console.log(`Creating deal for client ${clientId} and freelancer ${freelancerId}`);
      
      // Check if client has enough balance
      const hasSufficientBalance = await this.checkSufficientBalance(clientId, amountZec);
      if (!hasSufficientBalance) {
        throw new Error('Insufficient balance');
      }
      
      // Get client wallet
      const clientWallet = await zcashService.getWallet(clientId);
      if (!clientWallet) {
        throw new Error('Client wallet not found');
      }
      
      // Get or create freelancer wallet
      let freelancerWallet = await zcashService.getWallet(freelancerId);
      if (!freelancerWallet) {
        freelancerWallet = await this.createUserWallet(freelancerId, 'Auto-created wallet');
      }
      
      // Calculate deadline
      const deadline = Date.now() + (deadlineDays * 24 * 60 * 60 * 1000);
      const amountStr = amountZec.toString();
      
      // Get NEAR account IDs
      const clientNearAccount = await this.getNearAccountId(clientId);
      const freelancerNearAccount = await this.getNearAccountId(freelancerId);
      
      // Create intent on NEAR
      const intent = await nearService.createIntent(
        clientNearAccount,
        freelancerNearAccount,
        amountStr,
        deadline,
        description
      );
      
      // Lock funds in ZecVault contract
      const vaultAddress = await this.contract.getVaultAddress();
      
      // Convert ZEC to zatoshi
      const amountZatoshi = Math.floor(amountZec * 100000000);
      
      // Send funds to vault
      const tx = await zcashService.sendZec(
        clientId,
        vaultAddress,
        amountZatoshi
      );
      
      // Generate unique deal ID
      const dealId = `deal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      
      // Create deal object
      const deal = {
        dealId,
        client: {
          id: clientId,
          nearAccountId: clientNearAccount
        },
        freelancer: {
          id: freelancerId,
          nearAccountId: freelancerNearAccount
        },
        amount: amountStr,
        amountZec,
        deadline,
        description,
        status: 'created',
        intentId: intent.intentId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Store deal in database
      await db.storeDeal(deal);
      
      // Store transaction in database
      await db.storeTransaction({
        txId: tx.txId,
        dealId,
        fromAddress: clientWallet.addresses.shielded,
        toAddress: vaultAddress,
        amount: amountZatoshi,
        txType: 'escrow',
        status: 'pending',
        blockchain: 'zcash',
        timestamp: Date.now()
      });
      
      return deal;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  /**
   * Get all deals for a user
   */
  async getUserDeals(userId) {
    try {
      return await db.getUserDeals(userId);
    } catch (error) {
      console.error(`Error getting deals for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific deal by ID
   */
  async getDeal(dealId) {
    try {
      return await db.getDeal(dealId);
    } catch (error) {
      console.error(`Error getting deal ${dealId}:`, error);
      throw error;
    }
  }

  /**
   * Submit work for a deal
   */
  async submitWork(dealId, freelancerId, proofLink, notes = '') {
    try {
      // Get deal
      const deal = await db.getDeal(dealId);
      if (!deal) {
        throw new Error(`Deal ${dealId} not found`);
      }
      
      // Verify freelancer
      if (deal.freelancer.id !== freelancerId) {
        throw new Error('Only the freelancer can submit work');
      }
      
      // Update intent on NEAR
      await nearService.submitWork(
        deal.intentId,
        deal.freelancer.nearAccountId,
        proofLink,
        notes
      );
      
      // Update deal status
      deal.status = 'submitted';
      deal.proofLink = proofLink;
      deal.notes = notes;
      deal.updatedAt = Date.now();
      
      // Store updated deal
      await db.updateDeal(deal);
      
      return deal;
    } catch (error) {
      console.error(`Error submitting work for deal ${dealId}:`, error);
      throw error;
    }
  }

  /**
   * Approve work and release payment
   */
  async approveWork(dealId, clientId) {
    try {
      // Get deal
      const deal = await db.getDeal(dealId);
      if (!deal) {
        throw new Error(`Deal ${dealId} not found`);
      }
      
      // Verify client
      if (deal.client.id !== clientId) {
        throw new Error('Only the client can approve work');
      }
      
      // Update intent on NEAR
      await nearService.approveWork(
        deal.intentId,
        deal.client.nearAccountId
      );
      
      // Get freelancer wallet
      const freelancerWallet = await zcashService.getWallet(deal.freelancer.id);
      if (!freelancerWallet) {
        throw new Error('Freelancer wallet not found');
      }
      
      // Release funds from vault to freelancer
      await this.releaseEscrowFunds(deal, freelancerWallet.addresses.shielded);
      
      // Update deal status
      deal.status = 'completed';
      deal.updatedAt = Date.now();
      
      // Store updated deal
      await db.updateDeal(deal);
      
      return deal;
    } catch (error) {
      console.error(`Error approving work for deal ${dealId}:`, error);
      throw error;
    }
  }

  /**
   * Release funds from escrow vault to recipient
   */
  async releaseEscrowFunds(deal, recipientAddress) {
    try {
      // Call ZecVault contract to release funds
      if (this.wallet) {
        // Convert ZEC to zatoshi
        const amountZatoshi = Math.floor(deal.amountZec * 100000000);
        
        // Create record of this transaction in the contract
        const tx = await this.contract.releaseEscrow(
          deal.intentId,
          deal.client.nearAccountId,
          deal.freelancer.nearAccountId,
          amountZatoshi,
          recipientAddress
        );
        
        // Wait for transaction to be mined
        await tx.wait();
        console.log(`Escrow release transaction confirmed: ${tx.hash}`);
        
        // Store transaction in database
        await db.storeTransaction({
          txId: `eth-${tx.hash}`,
          dealId: deal.dealId,
          fromAddress: ZEC_VAULT_ADDRESS,
          toAddress: recipientAddress,
          amount: amountZatoshi,
          txType: 'release',
          status: 'confirmed',
          blockchain: 'ethereum',
          blockHeight: tx.blockNumber,
          confirmations: 1,
          timestamp: Date.now()
        });
        
        return tx.hash;
      } else {
        throw new Error('ZecVault contract not available in write mode');
      }
    } catch (error) {
      console.error('Error releasing escrow funds:', error);
      throw error;
    }
  }

  /**
   * Dispute work
   */
  async disputeWork(dealId, clientId) {
    try {
      // Get deal
      const deal = await db.getDeal(dealId);
      if (!deal) {
        throw new Error(`Deal ${dealId} not found`);
      }
      
      // Verify client
      if (deal.client.id !== clientId) {
        throw new Error('Only the client can dispute work');
      }
      
      // Update intent on NEAR
      await nearService.disputeWork(
        deal.intentId,
        deal.client.nearAccountId
      );
      
      // Update deal status
      deal.status = 'disputed';
      deal.updatedAt = Date.now();
      
      // Store updated deal
      await db.updateDeal(deal);
      
      return deal;
    } catch (error) {
      console.error(`Error disputing work for deal ${dealId}:`, error);
      throw error;
    }
  }

  /**
   * Resolve a disputed deal
   */
  async resolveDispute(dealId, adminId, resolution, notes = '') {
    try {
      // Get deal
      const deal = await db.getDeal(dealId);
      if (!deal) {
        throw new Error(`Deal ${dealId} not found`);
      }
      
      // Verify deal is disputed
      if (deal.status !== 'disputed') {
        throw new Error('Only disputed deals can be resolved');
      }
      
      // TODO: Add admin verification
      
      // Handle resolution
      if (resolution === 'client') {
        // Refund to client
        const clientWallet = await zcashService.getWallet(deal.client.id);
        await this.releaseEscrowFunds(deal, clientWallet.addresses.shielded);
        deal.status = 'cancelled';
      } else if (resolution === 'freelancer') {
        // Pay freelancer
        const freelancerWallet = await zcashService.getWallet(deal.freelancer.id);
        await this.releaseEscrowFunds(deal, freelancerWallet.addresses.shielded);
        deal.status = 'completed';
      } else {
        throw new Error('Invalid resolution. Must be "client" or "freelancer"');
      }
      
      // Update notes
      if (notes) {
        deal.notes = (deal.notes ? deal.notes + '\n\n' : '') + 
          `Dispute resolved in favor of ${resolution}. Admin notes: ${notes}`;
      }
      
      deal.updatedAt = Date.now();
      
      // Store updated deal
      await db.updateDeal(deal);
      
      return deal;
    } catch (error) {
      console.error(`Error resolving dispute for deal ${dealId}:`, error);
      throw error;
    }
  }

  /**
   * Get NEAR account ID for a user
   */
  async getNearAccountId(userId) {
    // In a production system, this would look up the user's NEAR account
    // For now, we'll generate a deterministic account name
    return `near-${userId.substring(0, 8)}.testnet`;
  }

  /**
   * Get user ID from NEAR account
   */
  getUserIdFromNearAccount(nearAccountId) {
    // In a production system, this would look up the user based on their NEAR account
    // For now, we'll extract from our naming pattern
    const match = nearAccountId.match(/^near-([a-zA-Z0-9]{8})\..*$/);
    return match ? match[1] : null;
  }

  /**
   * Process a confirmed Zcash transaction
   */
  async processConfirmedZcashTransaction(tx) {
    try {
      // Update transaction status in database
      await db.updateTransaction(
        tx.txId,
        'confirmed',
        tx.confirmations,
        tx.blockHeight
      );
      
      // If this is related to a deal, update the deal status
      if (tx.dealId) {
        const deal = await db.getDeal(tx.dealId);
        if (deal && tx.txType === 'release' && deal.status === 'approved') {
          deal.status = 'completed';
          deal.updatedAt = Date.now();
          await db.updateDeal(deal);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error processing confirmed Zcash transaction:', error);
      return false;
    }
  }
}

// Create singleton instance
const escrowService = new EscrowService();

module.exports = escrowService;

// If run directly, test the service
if (require.main === module) {
  async function testEscrowService() {
    try {
      // Initialize service
      const initialized = await escrowService.initialize();
      if (!initialized) {
        console.error('Failed to initialize Escrow service');
        process.exit(1);
      }
      
      // Create test wallets
      const client = await escrowService.createUserWallet('client1', 'Test Client');
      const freelancer = await escrowService.createUserWallet('freelancer1', 'Test Freelancer');
      
      console.log('Created client wallet:', client);
      console.log('Created freelancer wallet:', freelancer);
      
      // Start services
      escrowService.startServices();
      
      // Wait a bit for services to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Create a test deal
      const deal = await escrowService.createDeal(
        'client1',
        'freelancer1',
        1.5, // 1.5 ZEC
        7,   // 7 days deadline
        'Create a test website'
      );
      
      console.log('Created deal:', deal);
      
      // Submit work
      const submission = await escrowService.submitWork(
        deal.dealId,
        'freelancer1',
        'https://example.com/proof',
        'Work completed as requested'
      );
      
      console.log('Submitted work:', submission);
      
      // Approve work
      const approval = await escrowService.approveWork(deal.dealId, 'client1');
      
      console.log('Approved work:', approval);
      
      // Get deal information
      const dealInfo = await escrowService.getDeal(deal.dealId);
      
      console.log('Final deal status:', dealInfo);
      
      // Clean up
      escrowService.stopServices();
      console.log('Test completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error testing Escrow service:', error);
      escrowService.stopServices();
      process.exit(1);
    }
  }
  
  testEscrowService();
} 