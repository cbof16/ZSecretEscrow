# ZSecretEscrow

A privacy-focused escrow system built on Zcash with cross-chain integration for Base Sepolia and NEAR blockchains.

## Overview

ZSecretEscrow allows clients and freelancers to securely transact using Zcash for privacy, with escrow functionality handled through smart contracts on Base Sepolia and NEAR Protocol.

## Features

- **Privacy-focused payments**: Uses Zcash for private payments
- **Cross-chain integration**: Connects Zcash with Base Sepolia and NEAR Protocol
- **Secure escrow**: Funds are locked in smart contracts during the deal lifecycle
- **Dispute resolution**: Built-in process for resolving disputes
- **Workload verification**: Review and approve completed work before releasing funds

## System Architecture

The system consists of several key components:

1. **Zcash Integration**: Handles Zcash wallet management and transactions
2. **ZecVault Contract (EVM)**: Smart contract deployed on Base Sepolia for handling escrow
3. **EscrowIntent Contract (NEAR)**: Smart contract deployed on NEAR for intent management
4. **Escrow Service**: Coordinates between blockchain components
5. **Database**: SQLite database for storing deal and transaction information
6. **API Server**: Exposes RESTful endpoints for client applications
7. **Frontend**: React-based user interface for interacting with the system

## Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Access to Base Sepolia and NEAR testnets
- Zcash testnet access

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zsecretescrow.git
cd zsecretescrow
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration
```
# API Configuration
API_PORT=3000
FRONTEND_PORT=3001
PORT=8080
DB_PATH=./data/zescrow.db

# NEAR Configuration
NEAR_NETWORK=testnet
NEAR_NODE_URL=https://rpc.testnet.near.org
NEAR_ACCOUNT_ID=your-account.testnet
NEAR_PRIVATE_KEY=ed25519:your_private_key
ESCROW_INTENT_ID=your-account.testnet

# Base Sepolia Configuration
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
ZECVAULT_ADDRESS=0xYourContractAddress
PRIVATE_KEY=your_ethereum_private_key

# Zcash Configuration
ZCASH_NODE_URL=https://testnet.lightwalletd.com:9067
ZCASH_WALLET_API_URL=http://localhost:7000
ZCASH_MONITOR_INTERVAL=60000
```

5. Initialize the database:
```bash
npm run init-db
```

6. Deploy contracts (if not already deployed):
```bash
npm run deploy:zecvault
npm run deploy:escrow-intent
```

## Usage
### Start the Complete Application

To run both the API server and frontend in a single command:

```bash
npm start
```

Access the application at http://localhost:8080

### Start Components Separately

You can also run the components separately:

```bash
# Start the API Server only
npm run start:api

# Start the Frontend only
npm run start:frontend

# Start the Zcash transaction monitor
npm run start:zcash-monitor
```

### API Documentation

#### Health Check
- `GET /api/health` - Check API server status

#### Wallets
- `POST /api/wallets` - Create a new wallet
  - Request body: `{ "userId": "user123" }`
  - Response: `{ "id": 1, "userId": "user123", "address": "zs1...", "blockchain": "zcash" }`

- `GET /api/wallets/:userId` - Get wallet information
  - Response: `{ "id": 1, "user_id": "user123", "address": "zs1...", "blockchain": "zcash", "created_at": "..." }`

#### Deals
- `POST /api/deals` - Create a new deal
  - Request body: 
    ```json
    { 
      "clientId": "client123", 
      "freelancerId": "freelancer456", 
      "title": "Website Development", 
      "description": "Create a landing page", 
      "amount": 100
    }
    ```
  - Response: Deal object with status and transaction hash

- `GET /api/deals/:dealId` - Get deal information
  - Response: Complete deal object with all fields

- `GET /api/users/:userId/deals` - Get all deals for a user
  - Response: Array of deal objects for the specified user (as client or freelancer)

#### Work Submission/Approval
- `POST /api/deals/:dealId/submit` - Submit work for review
  - Request body: 
    ```json
    { 
      "workUrl": "https://github.com/user/project", 
      "comments": "Completed as requested" 
    }
    ```
  - Response: Confirmation with updated deal status

- `POST /api/deals/:dealId/approve` - Approve submitted work
  - Request body: 
    ```json
    { 
      "reviewComments": "Work looks good!" 
    }
    ```
  - Response: Confirmation with transaction hash

- `POST /api/deals/:dealId/dispute` - Dispute submitted work
  - Request body: 
    ```json
    { 
      "disputeReason": "Work does not meet requirements" 
    }
    ```
  - Response: Confirmation with updated deal status

#### Counter (Test Endpoints)
- `GET /api/counter` - Get counter value
  - Response: `{ "count": 3 }`

- `POST /api/counter/increment` - Increment counter
  - Response: Confirmation with transaction hash

## Development

### Database Schema

The application uses SQLite with the following tables:

1. **wallets**
   - id (PRIMARY KEY)
   - user_id
   - address
   - blockchain
   - created_at

2. **deals**
   - id (PRIMARY KEY)
   - client_id
   - freelancer_id
   - title
   - description
   - amount
   - intent_id
   - eth_escrow_id
   - status
   - work_url
   - submission_comments
   - review_comments
   - dispute_reason
   - created_at
   - updated_at

### Testing

Run the example workflow:
```bash
npm run example
```

### Monitor Zcash Transactions

```bash
npm run start:zcash-monitor
```

## For more detailed setup instructions

See [SETUP.md](SETUP.md) for more detailed setup and configuration instructions.

## License

MIT