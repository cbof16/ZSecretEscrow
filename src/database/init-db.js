/**
 * Database Initialization Script
 * This script initializes the SQLite database with the required schema
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to the schema SQL file
const schemaPath = path.join(__dirname, 'schema.sql');

// Path to the database file
const dbPath = path.join(__dirname, '..', '..', 'data', 'zescrow.db');

// Ensure the data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  console.log(`Creating data directory: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log(`Initializing database at: ${dbPath}`);

// Read the schema SQL
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Connect to the database
const db = new sqlite3.Database(dbPath);

// Execute the schema SQL
db.exec(schemaSql, (err) => {
  if (err) {
    console.error('Error initializing database:', err.message);
    process.exit(1);
  }
  
  console.log('Database initialized successfully');

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
      process.exit(1);
    }
    console.log('Database connection closed');
  });
});

// Run this script directly with: node src/database/init-db.js 