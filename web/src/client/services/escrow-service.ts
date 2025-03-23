import { WalletInterface } from '@/lib/wallet-context'

// Deal statuses
export type DealStatus = 'active' | 'pending' | 'completed' | 'disputed' | 'cancelled'

// Deal model interface
export interface Deal {
  id: string
  title: string
  description?: string
  status: DealStatus
  amount: number // in ZEC
  amountUsd?: number // Approximate USD value
  counterparty: string // Counterparty wallet address
  counterpartyName?: string
  createdAt: string
  updatedAt?: string
  progress?: number
  timeline?: Array<{
    date: string
    event: string
    actor?: string
  }>
  messages?: Array<{
    id: string
    sender: string
    content: string
    timestamp: string
    isRead: boolean
  }>
  documents?: Array<{
    id: string
    name: string
    size: string
    uploadedBy: string
    uploadedAt: string
    url: string
  }>
}

export class EscrowService {
  private wallet: WalletInterface
  private apiUrl: string
  
  // Mock deals for demonstration purposes
  private static mockDeals: Deal[] = [
    {
      id: 'deal-001',
      title: 'Website Development',
      description: 'Full stack website development with React, Next.js, and Node.js',
      status: 'active',
      amount: 3.5,
      amountUsd: 280,
      counterparty: 'zs1client12345678abcdefghijklmnopqrstuv',
      counterpartyName: 'John Client',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 65,
      timeline: [
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Deal created'
        },
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Funds deposited',
          actor: 'Client'
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Development started',
          actor: 'Freelancer'
        }
      ]
    },
    {
      id: 'deal-002',
      title: 'Logo Design',
      description: 'Professional logo design with 3 concepts and unlimited revisions',
      status: 'pending',
      amount: 1.2,
      amountUsd: 96,
      counterparty: 'zs1designer12345678abcdefghijklmnopqrstuv',
      counterpartyName: 'Design Studio',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'deal-003',
      title: 'Smart Contract Audit',
      description: 'Comprehensive security audit for DeFi protocol',
      status: 'completed',
      amount: 4.2,
      amountUsd: 336,
      counterparty: 'zs1auditor12345678abcdefghijklmnopqrstuv',
      counterpartyName: 'SecureAudit',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 100,
      timeline: [
        {
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Deal created'
        },
        {
          date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Funds deposited',
          actor: 'Client'
        },
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Audit report submitted',
          actor: 'Auditor'
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Funds released',
          actor: 'Client'
        }
      ]
    },
    {
      id: 'deal-004',
      title: 'NFT Collection Creation',
      description: '10 unique NFT artworks with metadata',
      status: 'disputed',
      amount: 2.8,
      amountUsd: 224,
      counterparty: 'zs1artist12345678abcdefghijklmnopqrstuv',
      counterpartyName: 'CryptoArtist',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 75,
      timeline: [
        {
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Deal created'
        },
        {
          date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Funds deposited',
          actor: 'Client'
        },
        {
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Partial delivery',
          actor: 'Artist'
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          event: 'Dispute raised',
          actor: 'Client'
        }
      ]
    }
  ]
  
  constructor(wallet: WalletInterface, apiUrl: string = 'https://api.zsecretescrow.com') {
    this.wallet = wallet
    this.apiUrl = apiUrl
  }
  
  // Get all deals for the current wallet
  async getDeals(): Promise<Deal[]> {
    // In a real implementation, this would call the API with wallet authentication
    console.log('Getting deals for wallet')
    
    // For now, return mock data
    return EscrowService.mockDeals
  }
  
  // Get a specific deal by ID
  async getDealById(dealId: string): Promise<Deal | null> {
    // In a real implementation, this would call the API
    console.log(`Getting deal ${dealId}`)
    
    // For now, return mock data
    const deal = EscrowService.mockDeals.find(d => d.id === dealId)
    return deal || null
  }
  
  // Create a new escrow deal
  async createDeal(params: {
    title: string
    description?: string
    amount: number
    counterparty: string
    milestones?: Array<{
      title: string
      amount: number
      description?: string
    }>
  }): Promise<{ dealId: string; txid: string }> {
    // In a real implementation, this would:
    // 1. Create the deal in the database
    // 2. Deploy or interact with a smart contract
    // 3. Send the funds to escrow
    console.log('Creating deal:', params)
    
    try {
      // 1. Create the deal (this would be an API call)
      const dealId = 'deal-' + Math.random().toString(36).substring(2, 9)
      
      // 2. Send funds to escrow
      const tx = await this.wallet.sendTransaction({
        recipient: 'zs1escrow12345678abcdefghijklmnopqrstuv', // This would be the escrow contract address
        amount: params.amount,
        memo: `Escrow:${dealId}:${params.title.substring(0, 20)}`
      })
      
      // 3. In a real implementation, confirm the transaction and update the deal status
      
      return {
        dealId,
        txid: tx.txid
      }
    } catch (error) {
      console.error('Failed to create deal:', error)
      throw error
    }
  }
  
  // Release funds from escrow to the counterparty
  async releaseFunds(dealId: string): Promise<{ txid: string }> {
    // In a real implementation, this would:
    // 1. Update the deal status in the database
    // 2. Interact with the smart contract to release funds
    console.log(`Releasing funds for deal ${dealId}`)
    
    try {
      // Mock transaction ID
      const txid = '0x' + Array(64).fill(0).map(() => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('')
      
      return { txid }
    } catch (error) {
      console.error('Failed to release funds:', error)
      throw error
    }
  }
  
  // Raise a dispute for a deal
  async raiseDispute(dealId: string, reason: string): Promise<{ disputeId: string }> {
    // In a real implementation, this would:
    // 1. Update the deal status to disputed
    // 2. Create a dispute record
    // 3. Notify relevant parties
    console.log(`Raising dispute for deal ${dealId} with reason: ${reason}`)
    
    try {
      // Mock dispute ID
      const disputeId = 'dispute-' + Math.random().toString(36).substring(2, 9)
      
      return { disputeId }
    } catch (error) {
      console.error('Failed to raise dispute:', error)
      throw error
    }
  }
  
  // Add a message to a deal
  async addMessage(dealId: string, content: string): Promise<{ messageId: string }> {
    // In a real implementation, this would call the API to add a message
    console.log(`Adding message to deal ${dealId}: ${content}`)
    
    try {
      // Mock message ID
      const messageId = 'msg-' + Math.random().toString(36).substring(2, 9)
      
      return { messageId }
    } catch (error) {
      console.error('Failed to add message:', error)
      throw error
    }
  }
  
  // Upload a document for a deal
  async uploadDocument(dealId: string, file: File): Promise<{ documentId: string; url: string }> {
    // In a real implementation, this would:
    // 1. Upload the file to storage (S3, IPFS, etc.)
    // 2. Associate the document with the deal in the database
    console.log(`Uploading document to deal ${dealId}: ${file.name} (${file.size} bytes)`)
    
    try {
      // Mock document ID and URL
      const documentId = 'doc-' + Math.random().toString(36).substring(2, 9)
      const url = `https://zsecretescrow.com/storage/${dealId}/${documentId}/${file.name}`
      
      return { 
        documentId,
        url
      }
    } catch (error) {
      console.error('Failed to upload document:', error)
      throw error
    }
  }
} 