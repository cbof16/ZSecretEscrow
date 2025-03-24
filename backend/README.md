# ZSecretEscrow Backend 🔧

<div align="center">
  <em>Backend Service for Privacy-Preserving Escrow Platform</em>
</div>

## 🏗️ Architecture

### Core Components
- **Transaction Monitor**: Tracks blockchain events
- **Cross-Chain Coordinator**: Manages multi-chain operations
- **API Server**: RESTful endpoints
- **Database**: Transaction and state storage

### Technology Stack
- Node.js with TypeScript
- Express.js for API
- PostgreSQL for database
- Redis for caching
- Bull for job queues

## 📦 Project Structure

```
backend/
├── src/
│   ├── api/              # API routes and controllers
│   ├── blockchain/       # Blockchain integration
│   │   ├── near/        # NEAR protocol integration
│   │   └── zcash/       # Zcash integration
│   ├── database/        # Database models and migrations
│   ├── jobs/            # Background jobs
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── tests/               # Test files
└── config/             # Configuration files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- PNPM

### Installation
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm run migrate

# Start development server
pnpm run dev
```

### Environment Variables
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/zsecretescrow

# Redis
REDIS_URL=redis://localhost:6379

# Blockchain
NEAR_NETWORK=testnet
NEAR_CONTRACT_ID=your_contract_id
ZCASH_NETWORK=testnet
ZCASH_RPC_URL=your_rpc_url
```

## 📝 API Documentation

### Core Endpoints

#### Escrow Management
```typescript
// Create escrow
POST /api/v1/escrow
{
  "amount": "1.0",
  "currency": "ZEC",
  "conditions": ["delivery", "verification"]
}

// Get escrow status
GET /api/v1/escrow/:id

// Verify delivery
POST /api/v1/escrow/:id/verify
{
  "proof": "proof_data"
}

// Release funds
POST /api/v1/escrow/:id/release
```

#### Transaction Monitoring
```typescript
// Get transaction status
GET /api/v1/transaction/:id

// Get transaction history
GET /api/v1/transactions
```

### WebSocket Events
```typescript
// Escrow events
escrow.created
escrow.updated
escrow.completed
escrow.disputed

// Transaction events
transaction.confirmed
transaction.failed
```

## 🔄 Background Jobs

### Transaction Monitor
```typescript
// Monitors blockchain events
class TransactionMonitor {
  async monitorNearEvents() {
    // Monitor NEAR contract events
  }
  
  async monitorZcashEvents() {
    // Monitor Zcash transactions
  }
}
```

### Cross-Chain Coordinator
```typescript
// Manages cross-chain operations
class CrossChainCoordinator {
  async coordinateEscrow(escrowId: string) {
    // Coordinate between NEAR and Zcash
  }
  
  async verifyCrossChainProof(proof: Proof) {
    // Verify cross-chain proofs
  }
}
```

## 🧪 Testing

### Unit Tests
```bash
pnpm run test:unit
```

### Integration Tests
```bash
pnpm run test:integration
```

### E2E Tests
```bash
pnpm run test:e2e
```

## 📊 Monitoring

### Health Checks
```typescript
// Health check endpoints
GET /health
GET /health/database
GET /health/redis
GET /health/blockchain
```

### Metrics
- Transaction success rate
- API response times
- Database performance
- Blockchain sync status

## 🔒 Security

### Authentication
- JWT-based authentication
- API key management
- Rate limiting

### Data Protection
- Encryption at rest
- Secure communication
- Input validation

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [Security Guidelines](./docs/security.md)

## 🤝 Contributing

Please see our [Contributing Guide](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 