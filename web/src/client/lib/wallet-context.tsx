"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Wallet types supported by the platform
export type WalletType = 
  | 'zcash-demo'     // For mock/demo implementation
  | 'zcash-ywallet'  // Coming soon
  | 'zcash-zingo'    // Coming soon
  | 'zcash-zashi'    // Coming soon
  | 'ethereum'
  | 'near'
  | 'base'
  | 'polygon'

// Wallet connection interface
export interface WalletConnection {
  id: string
  type: WalletType
  address: string
  shortAddress: string
  isDemo: boolean
  isPrimary: boolean
}

// User profile with wallet info
export interface UserProfile {
  userId: string
  wallets: WalletConnection[]
  primaryWallet: WalletConnection
  displayName?: string
  avatar?: string
  isVerified: boolean
  createdAt: Date
}

// Define wallet interface
export interface WalletInterface {
  address: string
  balance: number
  isDemo: boolean
  shortAddress: string
  sendTransaction: (to: string, amount: number) => Promise<string>
}

// Context interface
interface WalletContextType {
  walletConnections: WalletConnection[]
  primaryWallet: WalletInterface | null
  isAuthenticated: boolean
  isDemo: boolean
  connectWallet: (walletType: WalletType) => Promise<WalletInterface>
  setPrimaryWallet: (walletId: string) => void
  disconnectWallet: (walletId: string) => void
  disconnectAll: () => void
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Helper to format addresses for display
const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Mock Zcash wallet for demo purposes
class MockZcashWallet implements WalletInterface {
  address: string
  balance: number
  isDemo: boolean = true

  constructor() {
    // Generate a random mock address
    this.address = 'z' + Array(77).fill(0).map(() => 
      '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
    ).join('')
    // Random mock balance between 1 and 10 ZEC
    this.balance = Math.round((1 + Math.random() * 9) * 100) / 100
  }

  get shortAddress(): string {
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`
  }

  async sendTransaction(to: string, amount: number): Promise<string> {
    console.log(`DEMO: Sending ${amount} ZEC to ${to}`)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Generate a mock transaction ID
    const txid = Array(64).fill(0).map(() => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('')
    return txid
  }
}

// Wallet provider component
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([])
  const [primaryWallet, setPrimaryWalletState] = useState<WalletInterface | null>(null)
  
  // Determine if we're in demo mode
  const isDemo = walletConnections.some(w => w.isDemo && w.isPrimary)

  const router = useRouter()

  useEffect(() => {
    // Load saved wallet connections from local storage
    const savedConnections = localStorage.getItem('walletConnections')
    if (savedConnections) {
      try {
        const connections = JSON.parse(savedConnections)
        setWalletConnections(connections)
        
        // Find primary wallet and reconnect
        const primary = connections.find((conn: WalletConnection) => conn.isPrimary)
        if (primary) {
          connectWallet(primary.type).then(wallet => {
            setPrimaryWalletState(wallet)
          }).catch(err => {
            console.error('Failed to reconnect wallet:', err)
          })
        }
      } catch (error) {
        console.error('Failed to load wallet connections from local storage:', error)
      }
    }
  }, [])

  // Save wallet connections to local storage when they change
  useEffect(() => {
    if (walletConnections.length > 0) {
      localStorage.setItem('walletConnections', JSON.stringify(walletConnections))
    } else {
      localStorage.removeItem('walletConnections')
    }
  }, [walletConnections])

  const connectWallet = async (walletType: WalletType): Promise<WalletInterface> => {
    // Demo wallet implementation
    if (walletType === 'zcash-demo') {
      const mockWallet = new MockZcashWallet()
      
      // Add to wallet connections
      const connection: WalletConnection = {
        id: mockWallet.address,
        type: 'zcash-demo',
        address: mockWallet.address,
        shortAddress: mockWallet.shortAddress,
        isDemo: true,
        isPrimary: walletConnections.length === 0 // Make primary if first wallet
      }
      
      setWalletConnections(prev => {
        // Check if we already have this wallet
        const exists = prev.some(w => w.id === connection.id)
        if (exists) return prev
        
        // If this is the first wallet, make it primary
        const newConnections = [...prev, connection]
        if (newConnections.length === 1) {
          setPrimaryWalletState(mockWallet)
        }
        return newConnections
      })
      
      return mockWallet
    }
    
    // Other wallet implementations (coming soon)
    else if (walletType === 'zcash-ywallet') {
      throw new Error('Y Wallet integration coming soon!')
    }
    else if (walletType === 'zcash-zingo') {
      throw new Error('Zingo Wallet integration coming soon!')
    }
    else if (walletType === 'zcash-zashi') {
      throw new Error('Zashi Wallet integration coming soon!')
    }
    else {
      throw new Error('Unsupported wallet type')
    }
  }

  const setPrimaryWallet = (walletId: string) => {
    setWalletConnections(prev => 
      prev.map(conn => ({
        ...conn,
        isPrimary: conn.id === walletId
      }))
    )
    
    // Reconnect wallet to get an instance
    const connection = walletConnections.find(conn => conn.id === walletId)
    if (connection) {
      connectWallet(connection.type).then(wallet => {
        setPrimaryWalletState(wallet)
      }).catch(err => {
        console.error('Failed to set primary wallet:', err)
      })
    }
  }

  const disconnectWallet = (walletId: string) => {
    const wallet = walletConnections.find(w => w.id === walletId)
    if (!wallet) return
    
    // If we're disconnecting the primary wallet, clear the primary wallet state
    if (wallet.isPrimary) {
      setPrimaryWalletState(null)
    }
    
    // Remove the wallet from connections
    setWalletConnections(prev => {
      const remaining = prev.filter(w => w.id !== walletId)
      
      // If there are remaining wallets and we removed the primary, set a new primary
      if (remaining.length > 0 && wallet.isPrimary) {
        const newPrimary = {...remaining[0], isPrimary: true}
        
        // Reconnect the new primary
        connectWallet(newPrimary.type).then(wallet => {
          setPrimaryWalletState(wallet)
        }).catch(err => {
          console.error('Failed to set new primary wallet:', err)
        })
        
        return [newPrimary, ...remaining.slice(1)]
      }
      
      return remaining
    })
  }

  const disconnectAll = () => {
    setWalletConnections([])
    setPrimaryWalletState(null)
    localStorage.removeItem('walletConnections')
  }

  return (
    <WalletContext.Provider
      value={{
        walletConnections,
        primaryWallet,
        isAuthenticated: walletConnections.length > 0,
        isDemo,
        connectWallet,
        setPrimaryWallet,
        disconnectWallet,
        disconnectAll,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
} 