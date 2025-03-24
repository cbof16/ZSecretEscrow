"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Wallet types supported by the platform
export type WalletType = 'zcash' | 'ethereum' | 'near' | 'base' | 'polygon'

// Mock wallet implementation for demonstration purposes
// This will be replaced with real wallet implementations in production
export interface WalletConnection {
  address: string
  type: WalletType
  balance?: string
  shortAddress: string // Formatted for display
  isDemo?: boolean // Indicator that this is a demo wallet
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
  isDemoUser?: boolean // Indicator that this is a demo user
}

// Define wallet interface
export interface WalletInterface {
  getAddress: () => Promise<string>
  getBalance: () => Promise<{
    total: number
    available: number
    pending: number
    shielded: number
    transparent: number
  }>
  sendTransaction: (params: {
    recipient: string
    amount: number
    memo?: string
  }) => Promise<{ txid: string }>
  isDemo?: boolean // Flag to indicate this is a demo wallet
}

// Context interface
interface WalletContextType {
  isConnecting: boolean
  connectedWallets: WalletConnection[]
  primaryWallet: WalletConnection | null
  userProfile: UserProfile | null
  isAuthenticated: boolean
  wallet: WalletInterface | null
  walletType: WalletType | null
  error: string | null
  isDemo: boolean // Flag to indicate we're in demo mode
  
  // Methods
  connectWallet: (walletType: WalletType) => Promise<void>
  disconnectWallet: (address: string) => void
  disconnectAll: () => void
  setPrimaryWallet: (address: string) => void
  signMessage: (message: string) => Promise<string>
  sendZec: (recipient: string, amount: number, memo?: string) => Promise<{ txid: string }>
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Helper to format addresses for display
const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Helper to generate a realistic-looking Zcash address
const generateMockZcashAddress = (): string => {
  // Generate a random mock Zcash address (zs1... format for shielded)
  return 'zs1' + Array(30).fill(0).map(() => 
    'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
  ).join('')
}

// Helper to generate a realistic-looking transaction ID
const generateMockTxid = (): string => {
  return Array(64).fill(0).map(() => 
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('')
}

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Mock wallet implementation for demonstration purposes
class DemoWalletImplementation implements WalletInterface {
  private address: string = ''
  public isDemo: boolean = true
  
  constructor() {
    // Generate a mock Zcash address
    this.address = generateMockZcashAddress()
    
    // Log that this is a demo wallet
    console.log('DEMO WALLET ACTIVE: This is a simulation for demonstration purposes only')
  }
  
  async getAddress(): Promise<string> {
    console.log('Demo wallet - getAddress called')
    return this.address
  }
  
  async getBalance() {
    console.log('Demo wallet - getBalance called')
    
    // Return realistic-looking but fake balance data
    return {
      total: 5.75,
      available: 5.5,
      pending: 0.25,
      shielded: 5.0,
      transparent: 0.75
    }
  }
  
  async sendTransaction(params: { recipient: string; amount: number; memo?: string }) {
    console.log('Demo wallet - sendTransaction called:', params)
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate mock transaction ID
    const txid = generateMockTxid()
    
    console.log('Demo wallet - transaction simulated with ID:', txid)
    
    return { txid }
  }
}

// Helper function to check if running in demo mode (always true for hackathon)
const isDemoMode = (): boolean => {
  // For hackathon purposes, we're always in demo mode
  // In a production app, this would check environment variables or other config
  return true
}

// Wallet provider component
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [connectedWallets, setConnectedWallets] = useState<WalletConnection[]>([])
  const [primaryWallet, setPrimaryWalletState] = useState<WalletConnection | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [wallet, setWallet] = useState<WalletInterface | null>(null)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isDemo, setIsDemo] = useState<boolean>(true) // Always true for hackathon demo
  
  const router = useRouter()

  // Connect wallet function - memoized to prevent dependency issues in useEffect
  const connectWallet = useCallback(async (walletType: WalletType) => {
    setIsConnecting(true)
    setError(null)
    
    try {
      if (walletType === 'zcash') {
        console.log('Connecting to demo Zcash wallet...')
        
        // Use the demo wallet implementation
        const demoWallet = new DemoWalletImplementation()
        
        // Get wallet address and balance
        const address = await demoWallet.getAddress()
        const balance = await demoWallet.getBalance()
        
        setWallet(demoWallet)
        setWalletType('zcash')
        localStorage.setItem('walletType', 'zcash')
        setIsDemo(true)
        
        // Create wallet connection and user profile
        const walletConnection: WalletConnection = {
          address: address,
          type: 'zcash',
          shortAddress: formatAddress(address),
          balance: balance.total.toString(),
          isDemo: true
        }
        
        const userProfileData: UserProfile = {
          userId: address.substring(0, 16),
          wallets: [walletConnection],
          primaryWallet: walletConnection,
          displayName: 'Demo User',
          isVerified: false,
          createdAt: new Date(),
          isDemoUser: true
        }
        
        // Save wallet connection
        saveWalletConnection(walletConnection, userProfileData)
      }
      // Add other wallet types implementations here
      else {
        throw new Error(`Wallet type ${walletType} not supported yet`)
      }
      
    } catch (err: any) {
      console.error('Failed to connect wallet:', err)
      setError(err.message || 'Failed to connect wallet')
      setWallet(null)
      setWalletType(null)
      setIsAuthenticated(false)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }, []);

  // Check for existing wallet connections on mount
  useEffect(() => {
    const loadSavedWallets = () => {
      try {
        // Load saved wallet data from local storage
        const savedWallets = localStorage.getItem('connectedWallets')
        const savedProfile = localStorage.getItem('userProfile')
        
        if (savedWallets) {
          const wallets = JSON.parse(savedWallets) as WalletConnection[]
          setConnectedWallets(wallets)
          
          if (wallets.length > 0) {
            const primary = wallets.find(w => 
              localStorage.getItem('primaryWallet') === w.address
            ) || wallets[0]
            
            setPrimaryWalletState(primary)
          }
        }
        
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile))
          setIsAuthenticated(true) // Explicitly set authentication status if profile exists
        }
      } catch (error) {
        console.error('Failed to restore wallet connections:', error)
      }
    }
    
    loadSavedWallets()
  }, [])

  // Check for stored connection on mount
  useEffect(() => {
    const checkStoredConnection = async () => {
      const storedWalletType = localStorage.getItem('walletType') as WalletType | null
      
      if (storedWalletType) {
        try {
          setIsConnecting(true)
          await connectWallet(storedWalletType)
        } catch (err) {
          console.error('Failed to reconnect wallet:', err)
          localStorage.removeItem('walletType')
          setIsAuthenticated(false)
        } finally {
          setIsConnecting(false)
        }
      }
    }
    
    checkStoredConnection()
  }, [connectWallet]) // Add connectWallet to dependencies

  // Disconnect wallet function
  const disconnectWallet = (address: string) => {
    try {
      // Filter out the disconnected wallet
      const updatedWallets = connectedWallets.filter(w => w.address !== address)
      setConnectedWallets(updatedWallets)
      
      // Update primary wallet if needed
      if (primaryWallet?.address === address) {
        if (updatedWallets.length > 0) {
          setPrimaryWalletState(updatedWallets[0])
        } else {
          setPrimaryWalletState(null)
          setWallet(null)
          setWalletType(null)
          setUserProfile(null)
          setIsAuthenticated(false)
        }
      }
      
      // Update localStorage
      localStorage.setItem('connectedWallets', JSON.stringify(updatedWallets))
      
      if (updatedWallets.length === 0) {
        localStorage.removeItem('primaryWallet')
        localStorage.removeItem('userProfile')
        localStorage.removeItem('walletType')
      }
      
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  // Disconnect all wallets
  const disconnectAll = () => {
    try {
      setConnectedWallets([])
      setPrimaryWalletState(null)
      setWallet(null)
      setWalletType(null)
      setUserProfile(null)
      setIsAuthenticated(false)
      
      // Clear localStorage
      localStorage.removeItem('connectedWallets')
      localStorage.removeItem('primaryWallet')
      localStorage.removeItem('userProfile')
      localStorage.removeItem('walletType')
      
    } catch (error) {
      console.error('Failed to disconnect all wallets:', error)
    }
  }

  // Set primary wallet
  const setPrimaryWallet = (address: string) => {
    const wallet = connectedWallets.find(w => w.address === address)
    if (wallet) {
      setPrimaryWalletState(wallet)
      localStorage.setItem('primaryWallet', address)
      
      // Update user profile
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          primaryWallet: wallet
        }
        setUserProfile(updatedProfile)
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      }
    }
  }

  // Sign message with wallet (demo implementation)
  const signMessage = async (message: string): Promise<string> => {
    if (!primaryWallet) {
      throw new Error('No wallet connected')
    }
    
    console.log('Demo wallet - signMessage called with:', message)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Generate a realistic-looking but fake signature
    const mockSignature = `0x${Array.from(message).map(c => c.charCodeAt(0).toString(16)).join('')}${primaryWallet.address.substring(2, 10)}`
    
    console.log('Demo wallet - message signed with mock signature:', mockSignature)
    
    return mockSignature
  }

  // Send ZEC function
  const sendZec = async (recipient: string, amount: number, memo?: string) => {
    if (!wallet || walletType !== 'zcash') {
      throw new Error('Zcash wallet not connected')
    }
    
    console.log('Sending ZEC transaction (DEMO MODE):', { recipient, amount, memo })
    
    try {
      return await wallet.sendTransaction({
        recipient,
        amount,
        memo
      })
    } catch (err: any) {
      console.error('Transaction failed:', err)
      throw new Error(err.message || 'Failed to send transaction')
    }
  }

  // Helper to save wallet connection
  const saveWalletConnection = (walletData: WalletConnection, userProfileData: UserProfile) => {
    // Update connected wallets
    const existingWalletIndex = connectedWallets.findIndex(w => w.address === walletData.address)
    let updatedWallets: WalletConnection[]

    if (existingWalletIndex >= 0) {
      // Update existing wallet
      updatedWallets = [...connectedWallets]
      updatedWallets[existingWalletIndex] = walletData
    } else {
      // Add new wallet
      updatedWallets = [...connectedWallets, walletData]
    }

    // Update state
    setConnectedWallets(updatedWallets)
    setPrimaryWalletState(walletData)
    setUserProfile(userProfileData)
    setIsAuthenticated(true)

    // Update localStorage
    localStorage.setItem('connectedWallets', JSON.stringify(updatedWallets))
    localStorage.setItem('primaryWallet', walletData.address)
    localStorage.setItem('userProfile', JSON.stringify(userProfileData))
  }

  // Return context value
  const contextValue: WalletContextType = {
    isConnecting,
    connectedWallets,
    primaryWallet,
    userProfile,
    isAuthenticated,
    wallet,
    walletType,
    error,
    isDemo,
    
    // Methods
    connectWallet,
    disconnectWallet,
    disconnectAll,
    setPrimaryWallet,
    signMessage,
    sendZec
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
} 