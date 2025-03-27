import { 
  mockZcashTransactions, 
  mockNearTransactions, 
  mockBlockchainStatus,
  mockEscrowContracts,
  type ZcashTransaction,
  type NearTransaction,
  type EscrowContract
} from '../mock/blockchain'

// Simulated API call delays
const API_DELAY = 1000

// Service to handle blockchain interactions
export const blockchainService = {
  // ZCASH Functions
  getZcashStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return mockBlockchainStatus.zcash
  },
  
  getZcashTransactions: async () => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return mockZcashTransactions
  },
  
  sendZcashTransaction: async (
    amount: number, 
    recipient: string, 
    memo?: string
  ): Promise<ZcashTransaction> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY * 2))
    
    const newTx: ZcashTransaction = {
      id: `zec-tx-${Date.now()}`,
      amount,
      timestamp: new Date().toISOString(),
      sender: 'z_user_wallet...',
      recipient,
      status: 'pending',
      type: 'shielded',
      memo
    }
    
    return newTx
  },
  
  // NEAR Functions
  getNearStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return mockBlockchainStatus.near
  },
  
  getNearTransactions: async () => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return mockNearTransactions
  },
  
  sendNearTransaction: async (
    amount: string, 
    recipient: string
  ): Promise<NearTransaction> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY * 2))
    
    const newTx: NearTransaction = {
      id: `near-tx-${Date.now()}`,
      amount,
      timestamp: new Date().toISOString(),
      sender: 'user.near',
      recipient,
      status: 'pending',
      gas: '0.00025'
    }
    
    return newTx
  },
  
  // Escrow functions for both chains
  getEscrowContracts: async () => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return mockEscrowContracts
  },
  
  createEscrow: async (
    client: string,
    freelancer: string,
    amount: number,
    currency: 'ZEC' | 'NEAR',
    milestones: { description: string, amount: number, dueDate: string }[]
  ): Promise<EscrowContract> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY * 2))
    
    const now = new Date()
    const expiryDate = new Date()
    expiryDate.setDate(now.getDate() + 30) // 30 days from now
    
    const newEscrow: EscrowContract = {
      id: `escrow-${Date.now()}`,
      client,
      freelancer,
      amount,
      currency,
      status: 'pending',
      createdAt: now.toISOString(),
      expiresAt: expiryDate.toISOString(),
      milestones: milestones.map((m, index) => ({
        id: `milestone-${Date.now()}-${index}`,
        description: m.description,
        amount: m.amount,
        status: 'pending',
        dueDate: m.dueDate
      }))
    }
    
    return newEscrow
  },
  
  completeMilestone: async (escrowId: string, milestoneId: string): Promise<EscrowContract> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    
    // Find the escrow in the mock data
    const escrow = mockEscrowContracts.find(e => e.id === escrowId)
    if (!escrow) {
      throw new Error('Escrow not found')
    }
    
    // Clone the escrow and update the milestone
    const updatedEscrow = { ...escrow }
    const milestoneIndex = updatedEscrow.milestones.findIndex(m => m.id === milestoneId)
    
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found')
    }
    
    updatedEscrow.milestones[milestoneIndex] = {
      ...updatedEscrow.milestones[milestoneIndex],
      status: 'complete'
    }
    
    // Check if all milestones are complete
    const allComplete = updatedEscrow.milestones.every(m => m.status === 'complete')
    if (allComplete) {
      updatedEscrow.status = 'complete'
    }
    
    return updatedEscrow
  }
} 