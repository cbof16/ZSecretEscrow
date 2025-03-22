/**
 * NEAR Integration Service
 * 
 * This service provides methods to interact with the EscrowIntent contract
 * deployed on NEAR blockchain.
 */

const nearAPI = require('near-api-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

class NearService {
  constructor() {
    this.near = null;
    this.account = null;
    this.contract = null;
    this.config = null;
    this.contractId = process.env.NEAR_CONTRACT_NAME;
  }

  /**
   * Initialize the NEAR connection and contract
   */
  async initialize() {
    try {
      console.log('Initializing NEAR service...');

      // Check deployment info
      const deploymentPath = path.join(__dirname, '../../deployments/escrow-intent-deployment.json');
      try {
        const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
        this.contractId = deploymentInfo.contractName;
        console.log(`Using deployed contract at: ${this.contractId}`);
      } catch (error) {
        console.warn('Deployment info not found. Using contract from environment variables.');
      }

      // Get network and credentials
      const networkId = process.env.NEAR_NETWORK || 'testnet';
      const accountId = process.env.NEAR_ACCOUNT_ID;
      const privateKey = process.env.NEAR_PRIVATE_KEY;

      if (!accountId || !privateKey) {
        throw new Error('NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY must be set in .env');
      }

      // Setup keystore
      const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
      const keyPair = nearAPI.KeyPair.fromString(privateKey);
      await keyStore.setKey(networkId, accountId, keyPair);

      // Configure connection
      this.config = {
        networkId,
        keyStore,
        nodeUrl: `https://rpc.${networkId}.near.org`,
        walletUrl: `https://wallet.${networkId}.near.org`,
        helperUrl: `https://helper.${networkId}.near.org`,
        explorerUrl: `https://explorer.${networkId}.near.org`,
      };

      // Connect to NEAR
      this.near = await nearAPI.connect(this.config);
      this.account = await this.near.account(accountId);

      console.log(`Connected to NEAR ${networkId} as ${accountId}`);
      
      // Initialize contract
      this.contract = new nearAPI.Contract(
        this.account,
        this.contractId,
        {
          viewMethods: [
            'get_intent',
            'get_user_intents',
            'get_total_intents'
          ],
          changeMethods: [
            'create_intent',
            'submit_work',
            'approve_work',
            'dispute_work',
            'cancel_intent',
            'resolve_dispute'
          ],
        }
      );

      console.log(`Connected to EscrowIntent contract at: ${this.contractId}`);
      return true;
    } catch (error) {
      console.error('Error initializing NEAR service:', error);
      return false;
    }
  }

  /**
   * Create a new escrow intent
   * @param {string} intentId Unique identifier for the intent
   * @param {string} freelancerAccountId NEAR account ID of the freelancer 
   * @param {string} amount Amount in NEAR as a string (can include decimals)
   * @param {number} deadline Timestamp for the deadline
   * @param {string} description Description of the work
   * @returns {Promise<Object>} The created intent
   */
  async createIntent(intentId, freelancerAccountId, amount, deadline, description) {
    try {
      console.log(`Creating intent ${intentId} with freelancer ${freelancerAccountId}`);
      
      // Convert amount to yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
      const amountYocto = nearAPI.utils.format.parseNearAmount(amount.toString());
      
      return await this.contract.create_intent({
        intent_id: intentId,
        freelancer: freelancerAccountId,
        amount: amountYocto,
        deadline,
        description
      });
    } catch (error) {
      console.error('Error creating intent:', error);
      throw error;
    }
  }

  /**
   * Get intent by ID
   * @param {string} intentId The intent ID to look up
   * @returns {Promise<Object>} The intent details
   */
  async getIntent(intentId) {
    try {
      return await this.contract.get_intent({ intent_id: intentId });
    } catch (error) {
      console.error(`Error getting intent ${intentId}:`, error);
      throw error;
    }
  }

  /**
   * Get intents for a user
   * @param {string} accountId The NEAR account ID
   * @returns {Promise<Array>} Array of intents for the user
   */
  async getUserIntents(accountId) {
    try {
      return await this.contract.get_user_intents({ account_id: accountId });
    } catch (error) {
      console.error(`Error getting intents for user ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Submit work for an intent
   * @param {string} intentId The intent ID
   * @param {string} proofLink URL to proof of completed work
   * @param {string} notes Optional notes about the work
   * @returns {Promise<Object>} Updated intent
   */
  async submitWork(intentId, proofLink, notes) {
    try {
      console.log(`Submitting work for intent ${intentId}`);
      return await this.contract.submit_work({
        intent_id: intentId,
        proof_link: proofLink,
        notes: notes || null
      });
    } catch (error) {
      console.error(`Error submitting work for intent ${intentId}:`, error);
      throw error;
    }
  }

  /**
   * Approve work for an intent
   * @param {string} intentId The intent ID
   * @returns {Promise<Object>} Updated intent
   */
  async approveWork(intentId) {
    try {
      console.log(`Approving work for intent ${intentId}`);
      return await this.contract.approve_work({ intent_id: intentId });
    } catch (error) {
      console.error(`Error approving work for intent ${intentId}:`, error);
      throw error;
    }
  }

  /**
   * Dispute work for an intent
   * @param {string} intentId The intent ID
   * @returns {Promise<Object>} Updated intent
   */
  async disputeWork(intentId) {
    try {
      console.log(`Disputing work for intent ${intentId}`);
      return await this.contract.dispute_work({ intent_id: intentId });
    } catch (error) {
      console.error(`Error disputing work for intent ${intentId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel an intent
   * @param {string} intentId The intent ID
   * @returns {Promise<Object>} Updated intent
   */
  async cancelIntent(intentId) {
    try {
      console.log(`Canceling intent ${intentId}`);
      return await this.contract.cancel_intent({ intent_id: intentId });
    } catch (error) {
      console.error(`Error canceling intent ${intentId}:`, error);
      throw error;
    }
  }

  /**
   * Resolve a disputed intent (admin only)
   * @param {string} intentId The intent ID
   * @param {boolean} complete Whether to complete the intent or cancel it
   * @returns {Promise<Object>} Updated intent
   */
  async resolveDispute(intentId, complete) {
    try {
      console.log(`Resolving dispute for intent ${intentId}, complete=${complete}`);
      return await this.contract.resolve_dispute({
        intent_id: intentId,
        complete
      });
    } catch (error) {
      console.error(`Error resolving dispute for intent ${intentId}:`, error);
      throw error;
    }
  }

  /**
   * Get total number of intents
   * @returns {Promise<number>} Total intents count
   */
  async getTotalIntents() {
    try {
      return await this.contract.get_total_intents();
    } catch (error) {
      console.error('Error getting total intents:', error);
      throw error;
    }
  }
}

// Create singleton instance
const nearService = new NearService();

module.exports = nearService;

// If run directly, test the service
if (require.main === module) {
  async function testNearService() {
    try {
      const initialized = await nearService.initialize();
      if (!initialized) {
        console.error('Failed to initialize NEAR service');
        process.exit(1);
      }

      // Get total intents
      const totalIntents = await nearService.getTotalIntents();
      console.log(`Total intents: ${totalIntents}`);

      // Create a test intent
      const intentId = `intent-${Date.now()}`;
      const freelancer = process.env.NEAR_TEST_FREELANCER || process.env.NEAR_ACCOUNT_ID;
      const amount = '0.1'; // 0.1 NEAR
      const deadline = Date.now() + (7 * 24 * 60 * 60 * 1000); // 1 week
      const description = 'Test intent from NEAR service';

      const intent = await nearService.createIntent(
        intentId,
        freelancer,
        amount,
        deadline,
        description
      );

      console.log('Created intent:', intent);

      // Get the intent
      const retrievedIntent = await nearService.getIntent(intentId);
      console.log('Retrieved intent:', retrievedIntent);

      // Successfully exited
      console.log('NEAR service test completed successfully!');
    } catch (error) {
      console.error('Error testing NEAR service:', error);
    }
  }

  testNearService().then(() => process.exit(0)).catch(() => process.exit(1));
} 