require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Database path from .env or default
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/zescrow.db');
console.log(`Initializing database at: ${dbPath}`);

// Create or open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Run database initialization
db.serialize(() => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Create wallets table
  db.run(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      address TEXT NOT NULL,
      blockchain TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, blockchain)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating wallets table:', err);
    } else {
      console.log('wallets table created or already exists');
    }
  });
  
  // Create deals table
  db.run(`
    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT NOT NULL,
      freelancer_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      intent_id TEXT NOT NULL,
      eth_escrow_id INTEGER,
      status TEXT NOT NULL,
      work_url TEXT,
      submission_comments TEXT,
      review_comments TEXT,
      dispute_reason TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      UNIQUE(intent_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating deals table:', err);
    } else {
      console.log('deals table created or already exists');
    }
  });
  
  // Create transactions table to track Zcash transactions
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deal_id INTEGER,
      tx_id TEXT NOT NULL,
      amount REAL NOT NULL,
      from_address TEXT NOT NULL,
      to_address TEXT NOT NULL,
      blockchain TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(tx_id, blockchain),
      FOREIGN KEY(deal_id) REFERENCES deals(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating transactions table:', err);
    } else {
      console.log('transactions table created or already exists');
    }
  });
  
  console.log('Database initialization completed');
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
    process.exit(1);
  }
  console.log('Database connection closed');
}); 