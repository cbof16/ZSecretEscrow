/**
 * ZSecretEscrow Contracts Usage Examples
 * 
 * This file demonstrates how the ZecVault.sol and EscrowIntent.rs contracts
 * would be integrated and used in the application.
 */

// Import the Zcash mock for testing
const zcashMock = require('../mock/zcash');

// Mock ethers.js or web3.js for Ethereum interaction
class ZecVaultContract {
  constructor() {
    this.balances = {};
    this.lockedBalances = {};
    this.events = [];
  }

  // Simulate contract calls
  async updateBalance(userAddress, amount) {
    console.log(`Updating balance for ${userAddress} to ${amount} zatoshis`);
    this.balances[userAddress] = amount;
    this.events.push({
      event: 'BalanceUpdated',
      userAddress,
      amount,
      timestamp: Date.now()
    });
    return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` };
  }

  async getBalance(userAddress) {
    return this.balances[userAddress] || 0;
  }

  async lockBalance(userAddress, amount, dealId) {
    console.log(`Locking ${amount} zatoshis for user ${userAddress} in deal ${dealId}`);
    if (!this.balances[userAddress] || this.balances[userAddress] < amount) {
      throw new Error('Insufficient balance');
    }

    this.balances[userAddress] -= amount;
    if (!this.lockedBalances[userAddress]) {
      this.lockedBalances[userAddress] = {};
    }
    this.lockedBalances[userAddress][dealId] = amount;

    this.events.push({
      event: 'BalanceLocked',
      userAddress,
      amount,
      dealId,
      timestamp: Date.now()
    });

    return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` };
  }

  async releaseBalance(fromAddress, toAddress, amount, dealId) {
    console.log(`Releasing ${amount} zatoshis from ${fromAddress} to ${toAddress} for deal ${dealId}`);
    if (!this.lockedBalances[fromAddress] || 
        !this.lockedBalances[fromAddress][dealId] || 
        this.lockedBalances[fromAddress][dealId] < amount) {
      throw new Error('Insufficient locked balance');
    }

    this.lockedBalances[fromAddress][dealId] -= amount;
    this.balances[toAddress] = (this.balances[toAddress] || 0) + amount;

    this.events.push({
      event: 'BalanceReleased',
      fromAddress,
      toAddress,
      amount,
      dealId,
      timestamp: Date.now()
    });

    return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` };
  }

  async refundBalance(userAddress, dealId) {
    console.log(`Refunding locked balance for user ${userAddress} in deal ${dealId}`);
    if (!this.lockedBalances[userAddress] || 
        !this.lockedBalances[userAddress][dealId] || 
        this.lockedBalances[userAddress][dealId] <= 0) {
      throw new Error('No locked balance to refund');
    }

    const amount = this.lockedBalances[userAddress][dealId];
    this.lockedBalances[userAddress][dealId] = 0;
    this.balances[userAddress] = (this.balances[userAddress] || 0) + amount;

    this.events.push({
      event: 'BalanceReleased',
      fromAddress: userAddress,
      toAddress: userAddress,
      amount,
      dealId,
      timestamp: Date.now()
    });

    return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` };
  }
}

// Mock NEAR API for contract interaction
class EscrowIntentContract {
  constructor() {
    this.intents = {};
    this.userIntents = {};
    this.totalIntents = 0;
  }

  async createIntent(intentId, client, freelancer, amount, deadline, description) {
    console.log(`Creating intent ${intentId} from ${client} to ${freelancer}`);
    const timestamp = Date.now();
    
    const intent = {
      intent_id: intentId,
      client,
      freelancer,
      amount,
      deadline,
      description,
      proof_link: null,
      notes: null,
      status: 'Created',
      created_at: timestamp,
      updated_at: timestamp
    };

    this.intents[intentId] = intent;
    this.totalIntents++;
    
    if (!this.userIntents[client]) this.userIntents[client] = [];
    if (!this.userIntents[freelancer]) this.userIntents[freelancer] = [];
    
    this.userIntents[client].push(intentId);
    this.userIntents[freelancer].push(intentId);
    
    return intent;
  }

  async getIntent(intentId) {
    return this.intents[intentId] || null;
  }

  async getUserIntents(accountId) {
    const intentIds = this.userIntents[accountId] || [];
    return intentIds.map(id => this.intents[id]);
  }

  async submitWork(intentId, accountId, proofLink, notes) {
    console.log(`Submitting work for intent ${intentId} by ${accountId}`);
    const intent = this.intents[intentId];
    
    if (!intent) throw new Error('Intent not found');
    if (intent.freelancer !== accountId) throw new Error('Only freelancer can submit work');
    if (intent.status !== 'Created') throw new Error('Intent must be in Created status');
    
    intent.proof_link = proofLink;
    intent.notes = notes;
    intent.status = 'Approved';
    intent.updated_at = Date.now();
    
    return intent;
  }

  async approveWork(intentId, accountId) {
    console.log(`Approving work for intent ${intentId} by ${accountId}`);
    const intent = this.intents[intentId];
    
    if (!intent) throw new Error('Intent not found');
    if (intent.client !== accountId) throw new Error('Only client can approve work');
    if (intent.status !== 'Approved') throw new Error('Intent must be in Approved status');
    
    intent.status = 'Completed';
    intent.updated_at = Date.now();
    
    return intent;
  }

  async disputeWork(intentId, accountId) {
    console.log(`Disputing work for intent ${intentId} by ${accountId}`);
    const intent = this.intents[intentId];
    
    if (!intent) throw new Error('Intent not found');
    if (intent.client !== accountId) throw new Error('Only client can dispute work');
    if (intent.status !== 'Approved') throw new Error('Intent must be in Approved status');
    
    intent.status = 'Disputed';
    intent.updated_at = Date.now();
    
    return intent;
  }
}

// Create a service that coordinates between Zcash, ZecVault, and EscrowIntent
class EscrowService {
  constructor() {
    this.zecVault = new ZecVaultContract();
    this.escrowIntent = new EscrowIntentContract();
    this.zcash = zcashMock;
  }

  // Create Zcash address for a user
  async createZcashAddress(userId, label) {
    console.log(`Creating Zcash address for user ${userId}`);
    const addressInfo = this.zcash.createAddress(label);
    return addressInfo;
  }

  // Update on-chain balance from Zcash balance
  async syncZcashBalance(userId, zAddress) {
    console.log(`Syncing Zcash balance for user ${userId} with address ${zAddress}`);
    const balance = this.zcash.getBalance(zAddress);
    await this.zecVault.updateBalance(userId, balance);
    return balance;
  }

  // Create a new escrow deal
  async createDeal(clientId, freelancerId, amount, deadline, description) {
    // Generate unique deal ID
    const dealId = `deal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    console.log(`Creating new deal ${dealId} between ${clientId} and ${freelancerId}`);
    
    // Lock funds in ZecVault
    await this.zecVault.lockBalance(clientId, amount, dealId);
    
    // Create intent in NEAR
    await this.escrowIntent.createIntent(
      dealId,
      clientId,
      freelancerId,
      amount,
      deadline,
      description
    );
    
    return dealId;
  }

  // Freelancer submits work
  async submitWork(dealId, freelancerId, proofLink, notes) {
    console.log(`Freelancer ${freelancerId} submitting work for deal ${dealId}`);
    
    // Update intent in NEAR
    await this.escrowIntent.submitWork(dealId, freelancerId, proofLink, notes);
    
    return true;
  }

  // Client approves work and releases payment
  async approveWork(dealId, clientId) {
    console.log(`Client ${clientId} approving work for deal ${dealId}`);
    
    // Get intent details
    const intent = await this.escrowIntent.getIntent(dealId);
    if (!intent) throw new Error('Deal not found');
    
    // Update intent in NEAR
    await this.escrowIntent.approveWork(dealId, clientId);
    
    // Release funds in ZecVault
    await this.zecVault.releaseBalance(clientId, intent.freelancer, intent.amount, dealId);
    
    return true;
  }

  // Client disputes work
  async disputeWork(dealId, clientId) {
    console.log(`Client ${clientId} disputing work for deal ${dealId}`);
    
    // Update intent in NEAR
    await this.escrowIntent.disputeWork(dealId, clientId);
    
    return true;
  }

  // Admin resolves dispute
  async resolveDispute(dealId, adminId, completeJob) {
    console.log(`Admin ${adminId} resolving dispute for deal ${dealId}, complete=${completeJob}`);
    
    // Get intent details
    const intent = await this.escrowIntent.getIntent(dealId);
    if (!intent) throw new Error('Deal not found');
    
    if (completeJob) {
      // Release to freelancer
      await this.zecVault.releaseBalance(intent.client, intent.freelancer, intent.amount, dealId);
      // Update NEAR status to completed
      // This would normally be done by the contract but we're simulating here
      intent.status = 'Completed';
      intent.updated_at = Date.now();
    } else {
      // Refund to client
      await this.zecVault.refundBalance(intent.client, dealId);
      // Update NEAR status to cancelled
      intent.status = 'Cancelled';
      intent.updated_at = Date.now();
    }
    
    return true;
  }
}

// Example usage
async function runExample() {
  console.log('Starting ZSecretEscrow example workflow...');
  
  const escrowService = new EscrowService();
  
  // Create Zcash addresses for users
  const clientAddress = await escrowService.createZcashAddress('client1', 'Client Account');
  const freelancerAddress = await escrowService.createZcashAddress('freelancer1', 'Freelancer Account');
  
  console.log(`Client address: ${clientAddress.zAddress}`);
  console.log(`Freelancer address: ${freelancerAddress.zAddress}`);
  
  // Add test funds to client
  const fundingAmount = 500 * 1e8; // 500 ZEC
  escrowService.zcash.addFunds(clientAddress.zAddress, fundingAmount);
  console.log(`Added ${fundingAmount / 1e8} ZEC to client account`);
  
  // Sync balances with blockchain
  await escrowService.syncZcashBalance('client1', clientAddress.zAddress);
  await escrowService.syncZcashBalance('freelancer1', freelancerAddress.zAddress);
  
  // Create a deal
  const dealAmount = 100 * 1e8; // 100 ZEC
  const dealId = await escrowService.createDeal(
    'client1',
    'freelancer1',
    dealAmount,
    Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week deadline
    'Create a website for my business'
  );
  
  console.log(`Created deal with ID: ${dealId}`);
  
  // Freelancer submits work
  await escrowService.submitWork(
    dealId,
    'freelancer1',
    'https://github.com/freelancer/website-project',
    'Website completed as requested. Let me know if you need any revisions.'
  );
  
  console.log('Freelancer submitted work');
  
  // Client approves work
  await escrowService.approveWork(dealId, 'client1');
  
  console.log('Client approved work and released payment');
  
  // Check final balances
  const clientFinalBalance = await escrowService.zecVault.getBalance('client1');
  const freelancerFinalBalance = await escrowService.zecVault.getBalance('freelancer1');
  
  console.log(`Final client balance: ${clientFinalBalance / 1e8} ZEC`);
  console.log(`Final freelancer balance: ${freelancerFinalBalance / 1e8} ZEC`);
  
  console.log('Example workflow completed successfully!');
}

// Run the example
runExample().catch(error => {
  console.error('Error in example:', error);
});

module.exports = {
  ZecVaultContract,
  EscrowIntentContract,
  EscrowService,
  runExample
}; 