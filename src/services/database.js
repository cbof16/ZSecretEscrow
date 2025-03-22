/**
 * Database Service for ZSecretEscrow
 * Implements a SQLite database for storing deal and transaction information
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

class DatabaseService {
  constructor(dbPath = 'data/zescrow.db') {
    // Ensure data directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.dbPath = dbPath;
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the database, creating tables if they don't exist
   */
  async initialize() {
    try {
      if (this.isInitialized) return true;

      // Open database connection
      this.db = new sqlite3.Database(this.dbPath);
      
      // Convert SQLite methods to use promises
      this.dbRun = promisify(this.db.run.bind(this.db));
      this.dbAll = promisify(this.db.all.bind(this.db));
      this.dbGet = promisify(this.db.get.bind(this.db));
      
      // Create tables if they don't exist
      await this.createTables();
      
      this.isInitialized = true;
      console.log('Database initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      return false;
    }
  }

  /**
   * Create the necessary tables if they don't exist
   */
  async createTables() {
    // Create deals table
    await this.dbRun(`
      CREATE TABLE IF NOT EXISTS deals (
        deal_id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        client_near_account TEXT NOT NULL,
        freelancer_id TEXT NOT NULL,
        freelancer_near_account TEXT NOT NULL,
        amount TEXT NOT NULL,
        amount_zec REAL NOT NULL,
        deadline INTEGER NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        proof_link TEXT,
        notes TEXT,
        intent_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // Create transactions table
    await this.dbRun(`
      CREATE TABLE IF NOT EXISTS transactions (
        tx_id TEXT PRIMARY KEY,
        deal_id TEXT,
        from_address TEXT NOT NULL,
        to_address TEXT NOT NULL,
        amount REAL NOT NULL,
        tx_type TEXT NOT NULL,
        status TEXT NOT NULL,
        blockchain TEXT NOT NULL,
        block_height INTEGER,
        confirmations INTEGER DEFAULT 0,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (deal_id) REFERENCES deals(deal_id)
      )
    `);
    
    // Create wallets table
    await this.dbRun(`
      CREATE TABLE IF NOT EXISTS wallets (
        wallet_id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        label TEXT,
        transparent_address TEXT NOT NULL,
        shielded_address TEXT NOT NULL,
        seed_encrypted TEXT,
        created_at INTEGER NOT NULL
      )
    `);
    
    // Create blockchain_sync table to track last sync state
    await this.dbRun(`
      CREATE TABLE IF NOT EXISTS blockchain_sync (
        blockchain TEXT PRIMARY KEY,
        last_block_height INTEGER NOT NULL,
        last_sync_time INTEGER NOT NULL
      )
    `);
  }

  /**
   * Close the database connection
   */
  async close() {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db.close(err => {
          if (err) reject(err);
          else {
            this.isInitialized = false;
            resolve();
          }
        });
      });
    }
  }

  // Deal-related methods
  
  /**
   * Store a new deal in the database
   */
  async storeDeal(deal) {
    await this.dbRun(`
      INSERT INTO deals (
        deal_id, client_id, client_near_account, freelancer_id, freelancer_near_account,
        amount, amount_zec, deadline, description, status, proof_link, notes, intent_id,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      deal.dealId,
      deal.client.id,
      deal.client.nearAccountId,
      deal.freelancer.id,
      deal.freelancer.nearAccountId,
      deal.amount,
      deal.amountZec,
      deal.deadline,
      deal.description,
      deal.status,
      deal.proofLink || null,
      deal.notes || null,
      deal.intentId,
      deal.createdAt,
      deal.updatedAt
    ]);
    
    return deal;
  }

  /**
   * Update an existing deal
   */
  async updateDeal(deal) {
    await this.dbRun(`
      UPDATE deals SET
        status = ?,
        proof_link = ?,
        notes = ?,
        updated_at = ?
      WHERE deal_id = ?
    `, [
      deal.status,
      deal.proofLink || null,
      deal.notes || null,
      deal.updatedAt,
      deal.dealId
    ]);
    
    return deal;
  }

  /**
   * Get a deal by ID
   */
  async getDeal(dealId) {
    const deal = await this.dbGet('SELECT * FROM deals WHERE deal_id = ?', [dealId]);
    
    if (!deal) return null;
    
    return this.formatDealFromDb(deal);
  }

  /**
   * Get deals for a specific user (as client or freelancer)
   */
  async getUserDeals(userId) {
    const deals = await this.dbAll(
      'SELECT * FROM deals WHERE client_id = ? OR freelancer_id = ? ORDER BY updated_at DESC',
      [userId, userId]
    );
    
    return deals.map(deal => this.formatDealFromDb(deal));
  }

  /**
   * Format a deal from database format to application format
   */
  formatDealFromDb(deal) {
    return {
      dealId: deal.deal_id,
      client: {
        id: deal.client_id,
        nearAccountId: deal.client_near_account
      },
      freelancer: {
        id: deal.freelancer_id,
        nearAccountId: deal.freelancer_near_account
      },
      amount: deal.amount,
      amountZec: deal.amount_zec,
      deadline: deal.deadline,
      description: deal.description,
      status: deal.status,
      proofLink: deal.proof_link,
      notes: deal.notes,
      intentId: deal.intent_id,
      createdAt: deal.created_at,
      updatedAt: deal.updated_at
    };
  }

  // Transaction-related methods
  
  /**
   * Store a new transaction
   */
  async storeTransaction(tx) {
    await this.dbRun(`
      INSERT INTO transactions (
        tx_id, deal_id, from_address, to_address, amount, tx_type,
        status, blockchain, block_height, confirmations, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tx.txId,
      tx.dealId || null,
      tx.fromAddress,
      tx.toAddress,
      tx.amount,
      tx.txType,
      tx.status,
      tx.blockchain,
      tx.blockHeight || null,
      tx.confirmations || 0,
      tx.timestamp
    ]);
    
    return tx;
  }

  /**
   * Update transaction status and confirmations
   */
  async updateTransaction(txId, status, confirmations, blockHeight) {
    await this.dbRun(`
      UPDATE transactions SET
        status = ?,
        confirmations = ?,
        block_height = ?
      WHERE tx_id = ?
    `, [status, confirmations, blockHeight, txId]);
  }

  /**
   * Get transactions for a specific deal
   */
  async getDealTransactions(dealId) {
    return this.dbAll(
      'SELECT * FROM transactions WHERE deal_id = ? ORDER BY timestamp DESC',
      [dealId]
    );
  }

  /**
   * Get all pending transactions that need monitoring
   */
  async getPendingTransactions(blockchain) {
    return this.dbAll(
      'SELECT * FROM transactions WHERE blockchain = ? AND status = ? ORDER BY timestamp ASC',
      [blockchain, 'pending']
    );
  }

  // Wallet-related methods
  
  /**
   * Store a user's wallet information
   */
  async storeWallet(wallet) {
    await this.dbRun(`
      INSERT INTO wallets (
        wallet_id, user_id, label, transparent_address, 
        shielded_address, seed_encrypted, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        label = excluded.label,
        transparent_address = excluded.transparent_address,
        shielded_address = excluded.shielded_address,
        seed_encrypted = excluded.seed_encrypted
    `, [
      wallet.id,
      wallet.userId,
      wallet.label || null,
      wallet.addresses.transparent,
      wallet.addresses.shielded,
      wallet.seedEncrypted || null,
      wallet.createdAt || Date.now()
    ]);
    
    return wallet;
  }

  /**
   * Get a wallet by user ID
   */
  async getWallet(userId) {
    const wallet = await this.dbGet('SELECT * FROM wallets WHERE user_id = ?', [userId]);
    
    if (!wallet) return null;
    
    return {
      id: wallet.wallet_id,
      userId: wallet.user_id,
      label: wallet.label,
      addresses: {
        transparent: wallet.transparent_address,
        shielded: wallet.shielded_address
      },
      seedEncrypted: wallet.seed_encrypted,
      createdAt: wallet.created_at
    };
  }

  // Blockchain sync tracking
  
  /**
   * Update the last synchronized block for a blockchain
   */
  async updateSyncState(blockchain, blockHeight) {
    await this.dbRun(`
      INSERT INTO blockchain_sync (blockchain, last_block_height, last_sync_time)
      VALUES (?, ?, ?)
      ON CONFLICT(blockchain) DO UPDATE SET
        last_block_height = excluded.last_block_height,
        last_sync_time = excluded.last_sync_time
    `, [blockchain, blockHeight, Date.now()]);
  }

  /**
   * Get the last synchronized block for a blockchain
   */
  async getLastSyncState(blockchain) {
    return this.dbGet('SELECT * FROM blockchain_sync WHERE blockchain = ?', [blockchain]);
  }
}

module.exports = new DatabaseService(); 