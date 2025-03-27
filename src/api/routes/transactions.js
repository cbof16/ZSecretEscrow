const express = require('express');
const router = express.Router();

/**
 * Get transaction history
 * GET /api/transactions
 */
router.get('/', (req, res) => {
  // Optional pagination parameters
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  
  // Mock transaction data
  const transactions = [];
  const currentTime = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  // Generate some sample transactions
  for (let i = 0; i < limit; i++) {
    const timestamp = new Date(currentTime - i * oneDay).toISOString();
    const amount = (Math.random() * 5 + 0.1).toFixed(2);
    const types = ['deposit', 'withdrawal', 'escrow', 'release'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    transactions.push({
      id: `tx-${Date.now() - i * 1000}`,
      amount,
      type,
      timestamp,
      shielded: Math.random() > 0.5
    });
  }
  
  // Calculate pagination info
  const total = 100; // Mock total
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  });
});

/**
 * Get transaction details
 * GET /api/transactions/:id
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock transaction details
  res.json({
    id,
    amount: "1.5",
    type: "deposit",
    timestamp: new Date().toISOString(),
    shielded: true,
    confirmations: 12,
    from: "zs1sender...",
    to: "zs1receiver...",
    memo: "Payment for services",
    status: "confirmed"
  });
});

module.exports = router;
