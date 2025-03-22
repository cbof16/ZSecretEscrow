/**
 * Zcash Mock Module
 * 
 * This module provides mock functionality to simulate Zcash operations
 * for development and testing purposes.
 */

class ZcashMock {
  constructor() {
    // Store addresses and their balances (in zatoshis)
    this.balances = new Map();
    // Store transaction history
    this.transactions = [];
    // Store addresses and their metadata
    this.addresses = new Map();
    // Transaction counter
    this.txCounter = 1;
  }

  /**
   * Create a new Zcash address
   * @param {string} label Optional label for the address
   * @returns {Object} The new address details
   */
  createAddress(label = '') {
    // Generate a mock z-address (starts with 'z')
    const zAddress = 'z' + Array(77).fill(0).map(() => 
      'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
    
    // Generate a mock t-address (starts with 't')
    const tAddress = 't1' + Array(33).fill(0).map(() => 
      'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
    
    const addressInfo = {
      zAddress,
      tAddress,
      label,
      createdAt: new Date().toISOString()
    };
    
    // Store address metadata
    this.addresses.set(zAddress, addressInfo);
    
    // Initialize balance to 0
    this.balances.set(zAddress, 0);
    
    return addressInfo;
  }

  /**
   * Get address information
   * @param {string} address The z-address to look up
   * @returns {Object|null} Address information or null if not found
   */
  getAddressInfo(address) {
    return this.addresses.get(address) || null;
  }

  /**
   * Get balance for an address
   * @param {string} address The z-address to check
   * @returns {number} Balance in zatoshis (0 if address doesn't exist)
   */
  getBalance(address) {
    return this.balances.get(address) || 0;
  }

  /**
   * Add funds to an address (for testing)
   * @param {string} address The z-address to fund
   * @param {number} amount Amount in zatoshis
   * @returns {Object} Transaction details
   */
  addFunds(address, amount) {
    if (!this.addresses.has(address)) {
      throw new Error(`Address ${address} does not exist`);
    }

    // Get current balance
    const currentBalance = this.balances.get(address) || 0;
    
    // Update balance
    this.balances.set(address, currentBalance + amount);
    
    // Create a transaction record
    const tx = {
      txid: `mock-tx-${this.txCounter++}`,
      type: 'deposit',
      from: 'external',
      to: address,
      amount,
      fee: 0,
      timestamp: new Date().toISOString(),
      confirmations: 10
    };
    
    this.transactions.push(tx);
    
    return tx;
  }

  /**
   * Transfer funds between addresses
   * @param {string} fromAddress Sender z-address
   * @param {string} toAddress Recipient z-address
   * @param {number} amount Amount in zatoshis
   * @param {number} fee Fee in zatoshis
   * @returns {Object} Transaction details
   */
  transferFunds(fromAddress, toAddress, amount, fee = 1000) {
    if (!this.addresses.has(fromAddress)) {
      throw new Error(`From address ${fromAddress} does not exist`);
    }
    
    if (!this.addresses.has(toAddress)) {
      // For mock purposes, allow sending to any address even if we don't have it
      // In a real implementation, we would validate this differently
    }
    
    const balance = this.balances.get(fromAddress) || 0;
    
    if (balance < amount + fee) {
      throw new Error(`Insufficient balance in ${fromAddress}`);
    }
    
    // Update sender's balance
    this.balances.set(fromAddress, balance - amount - fee);
    
    // Update recipient's balance if we're tracking it
    if (this.balances.has(toAddress)) {
      const toBalance = this.balances.get(toAddress) || 0;
      this.balances.set(toAddress, toBalance + amount);
    }
    
    // Create a transaction record
    const tx = {
      txid: `mock-tx-${this.txCounter++}`,
      type: 'transfer',
      from: fromAddress,
      to: toAddress,
      amount,
      fee,
      timestamp: new Date().toISOString(),
      confirmations: 0
    };
    
    this.transactions.push(tx);
    
    // Simulate async confirmation after a delay
    setTimeout(() => {
      tx.confirmations = 1;
      setTimeout(() => {
        tx.confirmations = 6;
      }, 3000);
    }, 1000);
    
    return tx;
  }

  /**
   * Get transaction history for an address
   * @param {string} address The z-address
   * @param {number} limit Maximum number of transactions to return
   * @returns {Array} Array of transaction objects
   */
  getTransactionHistory(address, limit = 10) {
    return this.transactions
      .filter(tx => tx.from === address || tx.to === address)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get transaction details
   * @param {string} txid Transaction ID
   * @returns {Object|null} Transaction details or null if not found
   */
  getTransaction(txid) {
    return this.transactions.find(tx => tx.txid === txid) || null;
  }

  /**
   * Simulate waiting for transaction confirmations
   * @param {string} txid Transaction ID
   * @param {number} minConfirmations Minimum confirmations to wait for
   * @returns {Promise<Object>} Resolves with the transaction once confirmed
   */
  async waitForConfirmation(txid, minConfirmations = 6) {
    const tx = this.getTransaction(txid);
    if (!tx) {
      throw new Error(`Transaction ${txid} not found`);
    }
    
    // Function to check confirmation status
    const checkConfirmation = () => {
      return new Promise((resolve) => {
        if (tx.confirmations >= minConfirmations) {
          resolve(tx);
        } else {
          // Check again after 1 second
          setTimeout(() => resolve(checkConfirmation()), 1000);
        }
      });
    };
    
    return checkConfirmation();
  }
}

// Create and export a singleton instance
const zcashMock = new ZcashMock();

module.exports = zcashMock; 