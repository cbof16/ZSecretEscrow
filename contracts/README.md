# ZSecretEscrow Contracts 📜

<div align="center">
  <em>Smart Contracts for Privacy-Preserving Escrow Service</em>
</div>

## 🏗️ Contract Architecture

### NEAR Contract (`escrow-contract/`)
- **Purpose**: Manages escrow logic and fund release conditions
- **Language**: Rust
- **Features**:
  - Escrow creation and management
  - Delivery verification
  - Automated fund release
  - Dispute resolution

### Zcash Integration (`zcash-integration/`)
- **Purpose**: Handles private transactions and verification
- **Language**: TypeScript
- **Features**:
  - Shielded transaction management
  - Zero-knowledge proof generation
  - Privacy-preserving metadata handling

## 📦 Contract Structure

```
contracts/
├── escrow-contract/           # NEAR smart contract
│   ├── src/
│   │   ├── lib.rs            # Core contract logic
│   │   ├── escrow.rs         # Escrow management
│   │   ├── verification.rs   # Delivery verification
│   │   └── utils.rs          # Helper functions
│   └── tests/                # Contract tests
│
└── zcash-integration/        # Zcash transaction handling
    ├── src/
    │   ├── transaction.ts    # Transaction management
    │   ├── proof.ts          # Zero-knowledge proofs
    │   └── utils.ts          # Helper functions
    └── tests/                # Integration tests
```

## 🔧 Development

### Prerequisites
- Rust 1.70+
- NEAR CLI
- Node.js 18+
- TypeScript 5.0+

### Building NEAR Contract
```bash
cd escrow-contract
cargo build --target wasm32-unknown-unknown --release
```

### Building Zcash Integration
```bash
cd zcash-integration
pnpm install
pnpm build
```

## 📝 Contract Interfaces

### NEAR Contract
```rust
pub trait EscrowContract {
    // Escrow Management
    fn create_escrow(&mut self, params: CreateEscrowParams) -> String;
    fn deposit(&mut self, escrow_id: String, amount: u128) -> String;
    fn release(&mut self, escrow_id: String) -> String;
    
    // Verification
    fn verify_delivery(&mut self, escrow_id: String, proof: Proof) -> bool;
    fn verify_completion(&mut self, escrow_id: String) -> bool;
    
    // Dispute Resolution
    fn initiate_dispute(&mut self, escrow_id: String) -> String;
    fn resolve_dispute(&mut self, escrow_id: String, resolution: Resolution) -> String;
}
```

### Zcash Integration
```typescript
interface ZcashTransaction {
  // Transaction Management
  sendPrivateTransaction(params: {
    to: string;
    amount: number;
    memo?: string;
  }): Promise<string>;
  
  // Proof Generation
  generateProof(delivery: Delivery): Promise<Proof>;
  verifyProof(proof: Proof): Promise<boolean>;
  
  // Privacy Features
  encryptMemo(memo: string): Promise<string>;
  decryptMemo(encryptedMemo: string): Promise<string>;
}
```

## 🧪 Testing

### NEAR Contract Tests
```bash
cd escrow-contract
cargo test
```

### Zcash Integration Tests
```bash
cd zcash-integration
pnpm test
```

## 📊 Deployment

### NEAR Contract
```bash
near deploy escrow-contract.testnet ./target/wasm32-unknown-unknown/release/escrow_contract.wasm
```

### Zcash Integration
```bash
# Build and deploy to npm
cd zcash-integration
pnpm publish
```

## 🔒 Security Considerations

- **NEAR Contract**
  - Access control for admin functions
  - Timeout mechanisms for disputes
  - Proper error handling
  - State validation

- **Zcash Integration**
  - Secure key management
  - Transaction verification
  - Privacy preservation
  - Error handling

## 📚 Documentation

- [NEAR Contract Documentation](./escrow-contract/docs/README.md)
- [Zcash Integration Documentation](./zcash-integration/docs/README.md)
- [API Reference](./docs/api.md)
- [Security Guidelines](./docs/security.md)

## 🤝 Contributing

Please see our [Contributing Guide](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.