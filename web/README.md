# ZSecretEscrow Frontend 🌐

<div align="center">
  <em>Next.js Frontend for Privacy-Preserving Escrow Platform</em>
</div>

## 🎨 Design System

### UI Components
- Built with shadcn/ui
- Tailwind CSS for styling
- Custom privacy-focused components
- Responsive design

### Theme
- Dark mode by default
- Privacy-focused color scheme
- Clear transaction states
- Intuitive navigation

## 📦 Project Structure

```
web/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components
│   │   ├── escrow/      # Escrow-specific components
│   │   └── shared/      # Shared components
│   ├── lib/             # Utility functions and hooks
│   │   ├── blockchain/  # Blockchain integration
│   │   ├── wallet/      # Wallet management
│   │   └── api/         # API client
│   └── styles/          # Global styles
├── public/              # Static assets
└── tests/              # Frontend tests
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PNPM
- NEAR Wallet
- Zcash Wallet

### Installation
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start development server
pnpm run dev
```

### Environment Variables
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Blockchain
NEXT_PUBLIC_NEAR_NETWORK=testnet
NEXT_PUBLIC_NEAR_CONTRACT_ID=your_contract_id
NEXT_PUBLIC_ZCASH_NETWORK=testnet
```

## 🎯 Features

### Wallet Integration
```typescript
// Wallet connection
const { connect, disconnect, address } = useWallet();

// Transaction signing
const { signTransaction } = useTransaction();
```

### Escrow Management
```typescript
// Create escrow
const createEscrow = async (params: CreateEscrowParams) => {
  // Create escrow on NEAR
  const escrowId = await nearContract.createEscrow(params);
  
  // Send funds via Zcash
  await zcashTransaction.sendPrivateTransaction({
    to: escrowAddress,
    amount: params.amount,
    memo: escrowId
  });
};
```

### Privacy Features
```typescript
// Shielded transactions
const sendPrivateTransaction = async (params: TransactionParams) => {
  // Generate zero-knowledge proof
  const proof = await generateProof(params);
  
  // Send shielded transaction
  return await zcashTransaction.sendPrivateTransaction({
    ...params,
    proof
  });
};
```

## 🎨 UI Components

### Escrow Card
```typescript
<EscrowCard
  id={escrowId}
  amount={amount}
  status={status}
  onVerify={handleVerify}
  onRelease={handleRelease}
/>
```

### Transaction Status
```typescript
<TransactionStatus
  status={status}
  proof={proof}
  timestamp={timestamp}
/>
```

### Privacy Settings
```typescript
<PrivacySettings
  level={privacyLevel}
  onChange={handlePrivacyChange}
/>
```

## 🔄 State Management

### Wallet Context
```typescript
const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  
  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
```

### Escrow Context
```typescript
const EscrowProvider = ({ children }) => {
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  
  return (
    <EscrowContext.Provider value={{ escrows, setEscrows }}>
      {children}
    </EscrowContext.Provider>
  );
};
```

## 🧪 Testing

### Component Tests
```bash
pnpm run test:components
```

### Integration Tests
```bash
pnpm run test:integration
```

### E2E Tests
```bash
pnpm run test:e2e
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Mobile Features
- Touch-friendly interfaces
- Simplified navigation
- Optimized transaction flows
- Responsive data tables

## 🔒 Security

### Input Validation
```typescript
// Form validation
const validateEscrowForm = (data: EscrowFormData) => {
  // Validate amount
  if (data.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  // Validate conditions
  if (!data.conditions.length) {
    throw new Error('At least one condition is required');
  }
};
```

### Secure Storage
```typescript
// Secure local storage
const secureStorage = {
  set: (key: string, value: any) => {
    // Encrypt before storing
    const encrypted = encrypt(value);
    localStorage.setItem(key, encrypted);
  },
  
  get: (key: string) => {
    // Decrypt after retrieving
    const encrypted = localStorage.getItem(key);
    return decrypt(encrypted);
  }
};
```

## 📚 Documentation

- [Component Documentation](./docs/components.md)
- [State Management](./docs/state.md)
- [API Integration](./docs/api.md)
- [Security Guidelines](./docs/security.md)

## 🤝 Contributing

Please see our [Contributing Guide](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 