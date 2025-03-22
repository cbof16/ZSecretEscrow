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

### Start the API Server

```bash
npm run start:api
```

### Start the Full Application

```bash
npm start
```

### API Endpoints

#### Wallets
- `POST /wallets` - Create a new wallet
- `GET /wallets/:userId` - Get wallet information

#### Deals
- `POST /deals` - Create a new deal
- `GET /deals/:dealId` - Get deal information
- `GET /users/:userId/deals` - Get all deals for a user

#### Work Submission/Approval
- `POST /deals/:dealId/submit` - Submit work for review
- `POST /deals/:dealId/approve` - Approve submitted work
- `POST /deals/:dealId/dispute` - Dispute submitted work

## Development

### Testing

Run the example workflow:
```bash
npm run example
```

### Monitor Zcash Transactions

```bash
npm run start:zcash-monitor
```

## License

MIT