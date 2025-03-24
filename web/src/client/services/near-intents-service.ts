// Types for NEAR Intents
export type IntentStatus = 'open' | 'matched' | 'expired' | 'cancelled' | 'completed'
export type IntentType = 'escrow_client' | 'escrow_freelancer' | 'arbitrator'

export interface Intent {
  id: string
  type: IntentType
  creator: string
  description: string
  amount?: number
  parameters: Record<string, any>
  status: IntentStatus
  matchedWith?: string
  createdAt: number
  expiresAt?: number
}

export interface IntentMatch {
  intentId: string
  matchId: string
  escrowId?: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
}

// NEAR Intents Service for intent-based escrow
export class NEARIntentsService {
  private apiUrl: string
  private wallet: any // This would be your NEAR wallet integration
  private authToken?: string
  
  constructor(wallet: any, apiUrl: string = '/api/near-intents') {
    this.wallet = wallet
    this.apiUrl = apiUrl
    this.authToken = localStorage.getItem('authToken') || undefined
  }
  
  // Create a new intent for escrow
  async createIntent(params: {
    type: IntentType
    description: string
    amount?: number
    parameters: Record<string, any>
    expiresIn?: number // in hours
  }): Promise<Intent> {
    console.log('Creating NEAR intent:', params)
    
    try {
      const expiresAt = params.expiresIn 
        ? Date.now() + params.expiresIn * 60 * 60 * 1000 
        : undefined
      
      // Demo mode for development
      if (!this.wallet || this.wallet.isDemo) {
        return this.createMockIntent({
          ...params,
          expiresAt
        })
      }
      
      // Call the backend API to register the intent
      const response = await fetch(`${this.apiUrl}/intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {})
        },
        body: JSON.stringify({
          type: params.type,
          description: params.description,
          amount: params.amount,
          parameters: params.parameters,
          expiresAt
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create intent')
      }
      
      const intent = await response.json()
      
      // Sign the intent with the NEAR wallet to prove ownership
      if (this.wallet.signMessage) {
        const signature = await this.wallet.signMessage({
          message: `Intent:${intent.id}:${intent.creator}`
        })
        
        // Register the signature with the backend
        await fetch(`${this.apiUrl}/intents/${intent.id}/signature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {})
          },
          body: JSON.stringify({ signature })
        })
      }
      
      return intent
      
    } catch (error) {
      console.error('Failed to create intent:', error)
      throw error
    }
  }
  
  // Find matching intents for the given parameters
  async findMatchingIntents(params: {
    type: IntentType
    amount?: number
    parameters?: Record<string, any>
  }): Promise<Intent[]> {
    console.log('Finding matching intents:', params)
    
    try {
      // Demo mode for development
      if (!this.wallet || this.wallet.isDemo) {
        return Array(Math.floor(Math.random() * 3) + 1).fill(null).map(() => 
          this.createMockIntent({
            type: params.type === 'escrow_client' ? 'escrow_freelancer' : 'escrow_client',
            description: `Mock matching intent for ${params.type}`,
            amount: params.amount,
            parameters: params.parameters || {},
            expiresAt: Date.now() + 24 * 60 * 60 * 1000
          })
        )
      }
      
      // Build query string from parameters
      const queryParams = new URLSearchParams()
      queryParams.append('type', params.type === 'escrow_client' ? 'escrow_freelancer' : 'escrow_client')
      if (params.amount) queryParams.append('amount', params.amount.toString())
      
      // Add custom parameters to the query
      if (params.parameters) {
        for (const [key, value] of Object.entries(params.parameters)) {
          if (value !== undefined && value !== null) {
            queryParams.append(`parameters.${key}`, value.toString())
          }
        }
      }
      
      // Call the backend API to find matching intents
      const response = await fetch(`${this.apiUrl}/intents/match?${queryParams.toString()}`, {
        headers: {
          ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {})
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to find matching intents')
      }
      
      const matches = await response.json()
      return matches
      
    } catch (error) {
      console.error('Failed to find matching intents:', error)
      throw error
    }
  }
  
  // Accept a match between intents
  async acceptMatch(matchId: string): Promise<IntentMatch> {
    console.log(`Accepting match ${matchId}`)
    
    try {
      // Demo mode for development
      if (!this.wallet || this.wallet.isDemo) {
        return {
          intentId: `intent-${Math.random().toString(36).substring(2, 9)}`,
          matchId,
          escrowId: `escrow-${Math.random().toString(36).substring(2, 9)}`,
          status: 'accepted'
        }
      }
      
      // Call the backend API to accept the match
      const response = await fetch(`${this.apiUrl}/matches/${matchId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {})
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to accept match')
      }
      
      const match = await response.json()
      return match
      
    } catch (error) {
      console.error('Failed to accept match:', error)
      throw error
    }
  }
  
  // Get all intents created by the current user
  async getMyIntents(): Promise<Intent[]> {
    console.log('Getting my intents')
    
    try {
      // Demo mode for development
      if (!this.wallet || this.wallet.isDemo) {
        return Array(3).fill(null).map(() => this.createMockIntent({
          type: Math.random() > 0.5 ? 'escrow_client' : 'escrow_freelancer',
          description: `Mock intent ${Math.random().toString(36).substring(2, 9)}`,
          amount: Math.random() * 10 + 0.1,
          parameters: {},
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        }))
      }
      
      // Call the backend API to get user's intents
      const response = await fetch(`${this.apiUrl}/intents/my`, {
        headers: {
          ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {})
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to get intents')
      }
      
      const intents = await response.json()
      return intents
      
    } catch (error) {
      console.error('Failed to get intents:', error)
      throw error
    }
  }
  
  // Cancel an intent
  async cancelIntent(intentId: string): Promise<Intent> {
    console.log(`Cancelling intent ${intentId}`)
    
    try {
      // Demo mode for development
      if (!this.wallet || this.wallet.isDemo) {
        const mockIntent = this.createMockIntent({
          type: Math.random() > 0.5 ? 'escrow_client' : 'escrow_freelancer',
          description: `Cancelled intent`,
          amount: Math.random() * 10 + 0.1,
          parameters: {},
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        })
        mockIntent.status = 'cancelled'
        return mockIntent
      }
      
      // Call the backend API to cancel the intent
      const response = await fetch(`${this.apiUrl}/intents/${intentId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {})
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to cancel intent')
      }
      
      const intent = await response.json()
      return intent
      
    } catch (error) {
      console.error('Failed to cancel intent:', error)
      throw error
    }
  }
  
  // Helper method to create mock intents for demo mode
  private createMockIntent(params: {
    type: IntentType
    description: string
    amount?: number
    parameters: Record<string, any>
    expiresAt?: number
  }): Intent {
    return {
      id: `intent-${Math.random().toString(36).substring(2, 9)}`,
      type: params.type,
      creator: `near:demo.${Math.random().toString(36).substring(2, 9)}.testnet`,
      description: params.description,
      amount: params.amount,
      parameters: params.parameters,
      status: 'open',
      createdAt: Date.now(),
      expiresAt: params.expiresAt,
    }
  }
} 