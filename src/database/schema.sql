-- ZSecretEscrow Database Schema

-- Deals table
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
);

-- Transactions table
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
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  wallet_id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  label TEXT,
  transparent_address TEXT NOT NULL,
  shielded_address TEXT NOT NULL,
  seed_encrypted TEXT,
  created_at INTEGER NOT NULL
);

-- Blockchain sync tracking
CREATE TABLE IF NOT EXISTS blockchain_sync (
  blockchain TEXT PRIMARY KEY,
  last_block_height INTEGER NOT NULL,
  last_sync_time INTEGER NOT NULL
);

-- Users table for future implementation
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  salt TEXT,
  near_account_id TEXT,
  role TEXT DEFAULT 'user',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_client_id ON deals(client_id);
CREATE INDEX IF NOT EXISTS idx_deals_freelancer_id ON deals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_transactions_deal_id ON transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_transactions_blockchain ON transactions(blockchain);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- Insert initial admin user (for testing only)
INSERT OR IGNORE INTO users (
  user_id, username, email, password_hash, salt, role, created_at, updated_at
) VALUES (
  'admin', 'admin', 'admin@zescrow.test', 
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', -- 'password' (SHA-256)
  'salt123', 'admin', 
  strftime('%s', 'now') * 1000, 
  strftime('%s', 'now') * 1000
);

-- Insert initial blockchain tracking state
INSERT OR IGNORE INTO blockchain_sync (blockchain, last_block_height, last_sync_time)
VALUES ('zcash', 0, strftime('%s', 'now') * 1000);

INSERT OR IGNORE INTO blockchain_sync (blockchain, last_block_height, last_sync_time)
VALUES ('ethereum', 0, strftime('%s', 'now') * 1000);

INSERT OR IGNORE INTO blockchain_sync (blockchain, last_block_height, last_sync_time)
VALUES ('near', 0, strftime('%s', 'now') * 1000); 