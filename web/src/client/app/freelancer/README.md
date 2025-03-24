# Freelancer Demo Experience 🚀

<div align="center">
  <em>Privacy-Preserving Freelancer Experience on ZSecretEscrow</em>
</div>

## 🎯 Demo Flow

### 1. Freelancer Onboarding
```typescript
// Private Profile Setup
interface FreelancerProfile {
  // Public Information
  publicInfo: {
    skills: string[];
    hourlyRate: number;
    availability: string;
  };
  
  // Private Information
  privateInfo: {
    paymentAddress: string;
    verificationProof: Proof;
  };
}
```

### 2. Dashboard Experience
```typescript
// Dashboard Components
interface FreelancerDashboard {
  // Active Escrows
  activeEscrows: {
    id: string;
    amount: number;
    status: 'pending' | 'active' | 'completed';
    deadline: Date;
  }[];
  
  // Earnings Overview
  earnings: {
    total: number;
    pending: number;
    completed: number;
    shielded: number;
  };
  
  // Recent Activity
  recentActivity: {
    type: 'escrow' | 'payment' | 'verification';
    timestamp: Date;
    status: string;
  }[];
}
```

### 3. Escrow Management
```typescript
// Escrow Workflow
interface EscrowWorkflow {
  // Accept Escrow
  acceptEscrow(escrowId: string): Promise<string>;
  
  // Submit Delivery
  submitDelivery(escrowId: string, delivery: {
    proof: Proof;
    metadata: string;
    timestamp: Date;
  }): Promise<string>;
  
  // Track Status
  getStatus(escrowId: string): Promise<{
    status: string;
    progress: number;
    nextStep: string;
  }>;
}
```

### 4. Privacy Features
```typescript
// Privacy Implementation
interface PrivacyFeatures {
  // Shielded Earnings
  shieldedEarnings: {
    total: string;
    history: {
      amount: string;
      timestamp: Date;
      proof: Proof;
    }[];
  };
  
  // Private Reputation
  privateReputation: {
    score: number;
    completedJobs: number;
    verificationProof: Proof;
  };
}
```

## 🎨 UI Components

### Dashboard Cards
```typescript
// Active Escrows Card
<ActiveEscrowsCard
  escrows={activeEscrows}
  onSelect={handleEscrowSelect}
/>

// Earnings Overview Card
<EarningsCard
  earnings={earnings}
  onViewDetails={handleViewEarnings}
/>

// Recent Activity Card
<ActivityCard
  activities={recentActivity}
  onViewAll={handleViewAll}
/>
```

### Escrow Management
```typescript
// Escrow Details View
<EscrowDetails
  escrow={escrow}
  onAccept={handleAccept}
  onSubmit={handleSubmit}
/>

// Delivery Submission
<DeliverySubmission
  escrowId={escrowId}
  onSubmit={handleDeliverySubmit}
/>
```

### Privacy Controls
```typescript
// Privacy Settings
<PrivacySettings
  profile={profile}
  onUpdate={handlePrivacyUpdate}
/>

// Earnings Privacy
<EarningsPrivacy
  earnings={earnings}
  onShield={handleShieldEarnings}
/>
```

## 🔄 State Management

### Freelancer Context
```typescript
const FreelancerProvider = ({ children }) => {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [activeEscrows, setActiveEscrows] = useState<Escrow[]>([]);
  
  return (
    <FreelancerContext.Provider value={{
      profile,
      setProfile,
      activeEscrows,
      setActiveEscrows
    }}>
      {children}
    </FreelancerContext.Provider>
  );
};
```

## 🎯 Demo Scenarios

### 1. New Freelancer Onboarding
1. Create private profile
2. Set up shielded payment address
3. Configure privacy settings
4. View dashboard

### 2. Accepting an Escrow
1. View escrow details
2. Review requirements
3. Accept escrow
4. Start work

### 3. Submitting Work
1. Complete work
2. Generate delivery proof
3. Submit delivery
4. Track verification

### 4. Receiving Payment
1. Verify delivery
2. Receive shielded payment
3. View transaction history
4. Update earnings

## 🔒 Security Features

### Privacy Protection
```typescript
// Shielded Transactions
const shieldEarnings = async (amount: number) => {
  // Generate zero-knowledge proof
  const proof = await generateProof({
    amount,
    timestamp: Date.now()
  });
  
  // Send shielded transaction
  return await sendShieldedTransaction({
    amount,
    proof
  });
};
```

### Identity Protection
```typescript
// Private Profile
const updateProfile = async (updates: ProfileUpdates) => {
  // Encrypt sensitive data
  const encrypted = await encrypt(updates);
  
  // Update with proof
  return await updateProfileWithProof({
    updates: encrypted,
    proof: generateProfileProof(updates)
  });
};
```

## 📱 Mobile Experience

### Responsive Design
```css
/* Mobile-first approach */
.freelancer-dashboard {
  @apply p-4 md:p-6 lg:p-8;
}

.escrow-card {
  @apply mb-4 md:mb-6;
}

.earnings-overview {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}
```

### Touch Interactions
```typescript
// Touch-friendly components
<TouchableCard
  onPress={handlePress}
  onLongPress={handleLongPress}
>
  {/* Card content */}
</TouchableCard>
```

## 🧪 Testing

### Component Tests
```typescript
describe('FreelancerDashboard', () => {
  it('displays active escrows', () => {
    // Test implementation
  });
  
  it('updates earnings correctly', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('EscrowWorkflow', () => {
  it('completes escrow successfully', async () => {
    // Test implementation
  });
  
  it('handles delivery verification', async () => {
    // Test implementation
  });
});
```

## 📚 Documentation

- [Component Guide](./docs/components.md)
- [Privacy Features](./docs/privacy.md)
- [API Integration](./docs/api.md)
- [Security Guidelines](./docs/security.md)

## 🤝 Contributing

Please see our [Contributing Guide](../../../CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../../LICENSE) file for details. 