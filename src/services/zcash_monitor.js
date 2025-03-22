/**
 * Zcash Monitor Service
 * Monitors Zcash blockchain for transactions related to our escrow system
 */

const db = require('./database');
const zcashService = require('./zcash_service');
require('dotenv').config();

class ZcashMonitorService {
  constructor() {
    this.initialized = false;
    this.monitoring = false;
    this.intervalId = null;
    this.escrowService = null;
    this.updateInterval = parseInt(process.env.ZCASH_UPDATE_INTERVAL || '60000', 10);
    this.requiredConfirmations = parseInt(process.env.ZCASH_CONFIRMATION_BLOCKS || '6', 10);
  }

  /**
   * Initialize the Zcash monitor
   */
  async initialize(escrowService) {
    try {
      if (this.initialized) return true;

      console.log('Initializing Zcash Monitor Service...');
      
      // Store reference to escrow service
      this.escrowService = escrowService;
      
      // Make sure Zcash service is initialized
      if (!zcashService.isInitialized) {
        await zcashService.initialize();
      }

      // Get the last sync state from the database
      const syncState = await db.getLastSyncState('zcash');
      if (!syncState) {
        // Initialize sync state
        await db.updateSyncState('zcash', 0);
      }

      this.initialized = true;
      console.log('Zcash Monitor Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Zcash Monitor Service:', error);
      return false;
    }
  }

  /**
   * Start monitoring for transactions
   */
  async startMonitoring() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.monitoring) {
      console.log('Zcash Monitor is already running');
      return;
    }

    console.log(`Starting Zcash Monitor (interval: ${this.updateInterval}ms)...`);
    this.monitoring = true;

    // Do an initial check
    await this.checkTransactions();

    // Set up interval for regular checks
    this.intervalId = setInterval(async () => {
      await this.checkTransactions();
    }, this.updateInterval);

    console.log('Zcash Monitor started');
  }

  /**
   * Stop monitoring
   */
  async stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.monitoring = false;
    console.log('Zcash Monitor stopped');
  }

  /**
   * Check for pending transactions and update their status
   */
  async checkTransactions() {
    try {
      if (!this.monitoring) return;

      console.log('Checking for pending Zcash transactions...');

      // Get all pending transactions
      const pendingTxs = await db.getPendingTransactions('zcash');
      
      if (pendingTxs.length === 0) {
        console.log('No pending Zcash transactions found');
        return;
      }

      console.log(`Found ${pendingTxs.length} pending Zcash transactions`);

      // Check status of each transaction
      for (const tx of pendingTxs) {
        try {
          const txStatus = await zcashService.getTransactionStatus(tx.tx_id);
          
          if (!txStatus) {
            console.log(`Transaction ${tx.tx_id} not found on network`);
            continue;
          }

          if (txStatus.confirmations >= this.requiredConfirmations) {
            console.log(`Transaction ${tx.tx_id} confirmed with ${txStatus.confirmations} confirmations`);
            
            // Update transaction in database
            await db.updateTransaction(
              tx.tx_id,
              'confirmed',
              txStatus.confirmations,
              txStatus.blockHeight
            );

            // Notify escrow service about confirmed transaction
            if (this.escrowService) {
              await this.escrowService.processConfirmedZcashTransaction({
                txId: tx.tx_id,
                dealId: tx.deal_id,
                confirmations: txStatus.confirmations,
                blockHeight: txStatus.blockHeight,
                txType: tx.tx_type
              });
            }
          } else {
            console.log(`Transaction ${tx.tx_id} has ${txStatus.confirmations} confirmations, waiting for ${this.requiredConfirmations}`);
            
            // Update confirmation count
            await db.updateTransaction(
              tx.tx_id,
              'pending',
              txStatus.confirmations,
              txStatus.blockHeight
            );
          }
        } catch (txError) {
          console.error(`Error checking transaction ${tx.tx_id}:`, txError);
        }
      }
    } catch (error) {
      console.error('Error checking Zcash transactions:', error);
    }
  }

  /**
   * Get vault address from contract
   */
  async getVaultAddress() {
    // Get the vault address from the ZecVault contract
    if (this.escrowService && this.escrowService.contract) {
      return await this.escrowService.contract.getVaultAddress();
    }
    
    return process.env.ZCASH_VAULT_ADDRESS || 'zs1testvalut';
  }
}

module.exports = new ZcashMonitorService(); 