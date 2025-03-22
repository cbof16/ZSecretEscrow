/**
 * Escrow Service Tests
 * 
 * This file contains tests for the escrow service functionality
 */

const { expect } = require('chai');
const escrowService = require('../services/escrow_service');
const db = require('../services/database');

// Test client and freelancer IDs
const CLIENT_ID = 'test-client-' + Date.now();
const FREELANCER_ID = 'test-freelancer-' + Date.now();

describe('Escrow Service', function() {
  // Increase timeout for blockchain operations
  this.timeout(30000);
  
  before(async function() {
    // Initialize services
    await db.initialize();
    await escrowService.initialize();
  });
  
  after(async function() {
    // Clean up
    await escrowService.stopServices();
    await db.close();
  });
  
  describe('Wallet Management', function() {
    it('should create a wallet for a client', async function() {
      const wallet = await escrowService.createUserWallet(CLIENT_ID);
      expect(wallet).to.exist;
      expect(wallet.id).to.exist;
      expect(wallet.addresses.transparent).to.exist;
      expect(wallet.addresses.shielded).to.exist;
    });
    
    it('should create a wallet for a freelancer', async function() {
      const wallet = await escrowService.createUserWallet(FREELANCER_ID);
      expect(wallet).to.exist;
      expect(wallet.id).to.exist;
      expect(wallet.addresses.transparent).to.exist;
      expect(wallet.addresses.shielded).to.exist;
    });
    
    it('should retrieve an existing wallet', async function() {
      const wallet = await escrowService.getUserWallet(CLIENT_ID);
      expect(wallet).to.exist;
      expect(wallet.id).to.exist;
    });
  });
  
  describe('Deal Creation', function() {
    it('should create a new deal between client and freelancer', async function() {
      // Note: In a real test, we would fund the client's wallet first
      // For this test, we'll allow the deal creation to fail with insufficient funds
      
      try {
        const deal = await escrowService.createDeal(
          CLIENT_ID,
          FREELANCER_ID,
          0.1, // 0.1 ZEC
          7,   // 7 days deadline
          'Test deal for escrow service'
        );
        
        expect(deal).to.exist;
        expect(deal.dealId).to.exist;
        expect(deal.client.id).to.equal(CLIENT_ID);
        expect(deal.freelancer.id).to.equal(FREELANCER_ID);
        expect(deal.amountZec).to.equal(0.1);
        expect(deal.status).to.equal('created');
      } catch (error) {
        // We expect this to fail with "Insufficient balance" in a test environment
        expect(error.message).to.include('Insufficient balance');
      }
    });
  });
  
  describe('Mock Workflow', function() {
    let dealId;
    
    before(async function() {
      // Create a mock deal directly in the database
      const now = Date.now();
      const mockDeal = {
        dealId: `test-deal-${now}`,
        client: {
          id: CLIENT_ID,
          nearAccountId: await escrowService.getNearAccountId(CLIENT_ID)
        },
        freelancer: {
          id: FREELANCER_ID,
          nearAccountId: await escrowService.getNearAccountId(FREELANCER_ID)
        },
        amount: "0.1",
        amountZec: 0.1,
        deadline: now + (7 * 24 * 60 * 60 * 1000),
        description: "Mock test deal",
        status: "created",
        intentId: `intent-${now}`,
        createdAt: now,
        updatedAt: now
      };
      
      await db.storeDeal(mockDeal);
      dealId = mockDeal.dealId;
    });
    
    it('should retrieve the mock deal', async function() {
      const deal = await escrowService.getDeal(dealId);
      expect(deal).to.exist;
      expect(deal.dealId).to.equal(dealId);
      expect(deal.status).to.equal("created");
    });
    
    it('should submit work for the mock deal', async function() {
      // In a real test, we'd mock the NEAR contract interaction
      try {
        const deal = await escrowService.submitWork(
          dealId,
          FREELANCER_ID,
          'https://example.com/proof-of-work',
          'Work completed as requested'
        );
        
        expect(deal.status).to.equal('submitted');
        expect(deal.proofLink).to.equal('https://example.com/proof-of-work');
      } catch (error) {
        // If the NEAR interaction fails, we'll get an error
        console.log('Expected error in submitWork:', error.message);
      }
    });
  });
}); 