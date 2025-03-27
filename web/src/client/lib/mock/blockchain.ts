// Mock data for blockchain integrations

export interface ZcashTransaction {
  id: string;
  amount: number;
  timestamp: string;
  sender: string;
  recipient: string;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'shielded' | 'transparent';
  memo?: string;
}

export interface NearTransaction {
  id: string;
  amount: string;
  timestamp: string;
  sender: string;
  recipient: string;
  status: 'pending' | 'confirmed' | 'failed';
  gas: string;
}

export interface EscrowContract {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'disputed' | 'cancelled';
  value: number;
  currency: 'NEAR' | 'ZEC';
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  created: string;
  updated: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'disputed';
  dueDate: string;
}

// Mock Zcash transactions
export const mockZcashTransactions: ZcashTransaction[] = [
  {
    id: 'zec-tx-1',
    amount: 2.5,
    timestamp: '2023-03-15T10:30:00Z',
    sender: 'z_sender123...',
    recipient: 'z_recipient456...',
    status: 'confirmed',
    type: 'shielded',
    memo: 'Payment for website development'
  },
  {
    id: 'zec-tx-2',
    amount: 1.8,
    timestamp: '2023-03-12T14:20:00Z',
    sender: 'z_sender789...',
    recipient: 'z_recipient123...',
    status: 'confirmed',
    type: 'shielded',
    memo: 'Logo design payment'
  },
  {
    id: 'zec-tx-3',
    amount: 0.5,
    timestamp: '2023-03-18T09:15:00Z',
    sender: 'z_recipient456...',
    recipient: 'z_sender123...',
    status: 'pending',
    type: 'shielded',
    memo: 'Refund for cancelled project'
  }
];

// Mock NEAR transactions
export const mockNearTransactions: NearTransaction[] = [
  {
    id: 'near-tx-1',
    amount: '50.0',
    timestamp: '2023-03-16T11:45:00Z',
    sender: 'alice.near',
    recipient: 'bob.near',
    status: 'confirmed',
    gas: '0.00025'
  },
  {
    id: 'near-tx-2',
    amount: '25.0',
    timestamp: '2023-03-14T16:30:00Z',
    sender: 'charlie.near',
    recipient: 'dave.near',
    status: 'confirmed',
    gas: '0.00025'
  },
  {
    id: 'near-tx-3',
    amount: '10.0',
    timestamp: '2023-03-17T13:20:00Z',
    sender: 'bob.near',
    recipient: 'alice.near',
    status: 'pending',
    gas: '0.00025'
  }
];

// Mock escrow contracts for the demo mode
export const mockEscrowContracts: EscrowContract[] = [
  {
    id: 'escrow-1',
    title: 'Website Development',
    description: 'Full-stack web application with user authentication and payment processing',
    status: 'active',
    value: 120,
    currency: 'NEAR',
    clientId: 'alice.near',
    clientName: 'Alice',
    freelancerId: 'demo.near',
    freelancerName: 'You',
    created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    milestones: [
      {
        id: 'milestone-1-1',
        title: 'Frontend Design',
        description: 'Create UI/UX design and implement frontend pages',
        amount: 40,
        status: 'completed',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone-1-2',
        title: 'Backend Development',
        description: 'Implement REST API and database models',
        amount: 50,
        status: 'active',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone-1-3',
        title: 'Deployment & Testing',
        description: 'Deploy application and conduct final testing',
        amount: 30,
        status: 'pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'escrow-2',
    title: 'Logo Design',
    description: 'Design a modern logo for a technology company',
    status: 'completed',
    value: 3.5,
    currency: 'ZEC',
    clientId: 'z_sender123456789abcdefghijk',
    clientName: 'Anonymous Client',
    freelancerId: 'demo.near',
    freelancerName: 'You',
    created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    milestones: [
      {
        id: 'milestone-2-1',
        title: 'Initial Concepts',
        description: 'Create 3 initial logo concepts',
        amount: 1,
        status: 'completed',
        dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone-2-2',
        title: 'Refinement',
        description: 'Refine selected concept with client feedback',
        amount: 1.5,
        status: 'completed',
        dueDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone-2-3',
        title: 'Final Delivery',
        description: 'Deliver final logo in all required formats',
        amount: 1,
        status: 'completed',
        dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'escrow-3',
    title: 'Mobile App Development',
    description: 'Develop a cross-platform mobile app for iOS and Android',
    status: 'active',
    value: 200,
    currency: 'NEAR',
    clientId: 'bob.near',
    clientName: 'Bob',
    freelancerId: 'demo.near',
    freelancerName: 'You',
    created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    milestones: [
      {
        id: 'milestone-3-1',
        title: 'App Architecture',
        description: 'Design app architecture and create wireframes',
        amount: 50,
        status: 'active',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone-3-2',
        title: 'UI Implementation',
        description: 'Implement user interface and core functionality',
        amount: 80,
        status: 'pending',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone-3-3',
        title: 'Testing & Store Submission',
        description: 'Test app and submit to app stores',
        amount: 70,
        status: 'pending',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

// Mock blockchain status
export const mockBlockchainStatus = {
  zcash: {
    connected: true,
    network: 'testnet',
    blockHeight: 2042156,
    syncStatus: '100%',
    latestBlock: {
      hash: '00000a3b7bc8e0deb7f9ab8595c02b6c8mf93u8a2e41f0c4e04c0fh76d5a40b',
      timestamp: '2023-03-18T10:00:00Z'
    }
  },
  near: {
    connected: true,
    network: 'testnet',
    blockHeight: 87654321,
    syncStatus: '100%',
    latestBlock: {
      hash: 'EQtz5iR1QcDuR3zPcRoUg68qJWkGE7niPq5jQp2b4j3H',
      timestamp: '2023-03-18T10:05:00Z'
    }
  }
}; 