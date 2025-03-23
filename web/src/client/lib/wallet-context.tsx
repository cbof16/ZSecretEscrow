"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Wallet types supported by the platform
export type WalletType = 'zcash' | 'ethereum' | 'near' | 'base' | 'polygon'

// Y Wallet types
type YWalletAccount = {
  id: string
  name: string
  address: string
  network: string
  balance: {
    spendableValue: number
    pendingValue: number
    totalValue: number
    transparentValue: number
    shieldedValue: number
  }
}

type YWalletEvents = 'account.changed' | 'network.changed' | 'account.locked' | 'account.unlocked'

// Y Wallet interface based on the EIP-6963 standard
interface YWallet {
  accounts: YWalletAccount[]
  isConnected: boolean
  request: (args: {
    method: string,
    params?: any
  }) => Promise<any>
  on: (event: YWalletEvents, callback: (data: any) => void) => void
  off: (event: YWalletEvents, callback: (data: any) => void) => void
}

declare global {
  interface Window {
    ywallet?: YWallet
  }
}

// Wallet connection interface
export interface WalletConnection {
  address: string
  type: WalletType
  balance?: string
  shortAddress: string // Formatted for display
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

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Real Y Wallet SDK implementation
class YWalletImplementation implements WalletInterface {
  private ywallet: YWallet | null = null
  private activeAccount: YWalletAccount | null = null
  
  constructor() {
    // Get the Y Wallet instance from the window object
    this.ywallet = window.ywallet || null
    
    // Set up event listeners if Y Wallet is available
    if (this.ywallet) {
      this.setupEventListeners()
    }
  }
  
  private setupEventListeners() {
    if (!this.ywallet) return
    
    // Listen for account changes
    this.ywallet.on('account.changed', (account) => {
      console.log('Account changed:', account)
      this.activeAccount = account
    })
    
    // Listen for network changes
    this.ywallet.on('network.changed', (network) => {
      console.log('Network changed:', network)
    })
  }
  
  async connect(): Promise<YWalletAccount> {
    if (!this.ywallet) {
      throw new Error('Y Wallet extension not found')
    }
    
    try {
      // Request connection to the wallet
      await this.ywallet.request({ method: 'account.connect' })
      
      // Get the connected account
      const accounts = this.ywallet.accounts
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts available in Y Wallet')
      }
      
      // Set the active account
      this.activeAccount = accounts[0]
      return this.activeAccount
    } catch (error: any) {
      console.error('Failed to connect to Y Wallet:', error)
      throw new Error(error.message || 'Failed to connect to Y Wallet')
    }
  }
  
  async getAddress(): Promise<string> {
    if (!this.activeAccount) {
      throw new Error('No active account')
    }
    return this.activeAccount.address
  }
  
  async getBalance() {
    if (!this.ywallet || !this.activeAccount) {
      throw new Error('Wallet not connected')
    }
    
    try {
      // Use the existing balance from the active account
      // In a real implementation, you might want to refresh this
      const balance = this.activeAccount.balance
      
      return {
        total: balance.totalValue,
        available: balance.spendableValue,
        pending: balance.pendingValue,
        shielded: balance.shieldedValue,
        transparent: balance.transparentValue
      }
    } catch (error: any) {
      console.error('Failed to get balance:', error)
      throw new Error(error.message || 'Failed to get balance')
    }
  }
  
  async sendTransaction(params: { recipient: string; amount: number; memo?: string }) {
    if (!this.ywallet || !this.activeAccount) {
      throw new Error('Wallet not connected')
    }
    
    try {
      // Create a transaction using Y Wallet's API
      const result = await this.ywallet.request({
        method: 'transaction.create',
        params: {
          to: params.recipient,
          amount: params.amount,
          memo: params.memo || '',
          from: this.activeAccount.address
        }
      })
      
      return { txid: result.txid }
    } catch (error: any) {
      console.error('Transaction failed:', error)
      throw new Error(error.message || 'Failed to send transaction')
    }
  }
  
  // Clean up event listeners
  cleanup() {
    if (this.ywallet) {
      this.ywallet.off('account.changed', () => {})
      this.ywallet.off('network.changed', () => {})
    }
  }
}

// Helper function to check if browser has Y Wallet extension
const hasYWalletExtension = (): boolean => {
  const hasExtension = typeof window !== 'undefined' && !!window.ywallet
  console.log('Y Wallet extension check:', hasExtension)
  return hasExtension
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
  
  const router = useRouter()

  // Connect wallet function - memoized to prevent dependency issues in useEffect
  const connectWallet = useCallback(async (walletType: WalletType) => {
    setIsConnecting(true)
    setError(null)
    
    try {
      if (walletType === 'zcash') {
        // Check if Y Wallet extension is available
        if (!hasYWalletExtension()) {
          console.log('Y Wallet extension not found')
          setError('Y Wallet extension not found. Please install it from https://ywallet.app/.')
          throw new Error('Y Wallet extension not found. Please install it from https://ywallet.app/.')
        }
        
        console.log('Connecting to Y Wallet...')
        
        // Use the real Y Wallet implementation
        const yWallet = new YWalletImplementation()
        
        try {
          // Connect to the wallet and get the account
          console.log('Requesting wallet connection...')
          const account = await yWallet.connect()
          console.log('Connected to account:', account)
          
          // Get wallet balance
          const balance = await yWallet.getBalance()
          
          setWallet(yWallet)
          setWalletType('zcash')
          localStorage.setItem('walletType', 'zcash')
          
          // Create wallet connection and user profile
          const walletConnection: WalletConnection = {
            address: account.address,
            type: 'zcash',
            shortAddress: formatAddress(account.address),
            balance: balance.total.toString()
          }
          
          const userProfileData: UserProfile = {
            userId: account.id,
            wallets: [walletConnection],
            primaryWallet: walletConnection,
            displayName: account.name,
            isVerified: false,
            createdAt: new Date()
          }
          
          // Save wallet connection
          saveWalletConnection(walletConnection, userProfileData)
        } catch (connectionError: any) {
          console.error('Y Wallet connection error:', connectionError)
          setError(connectionError.message || 'Failed to connect to Y Wallet')
          throw connectionError
        }
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

  // Clean up event listeners when unmounting
  useEffect(() => {
    return () => {
      if (wallet && walletType === 'zcash') {
        (wallet as YWalletImplementation).cleanup()
      }
    }
  }, [wallet, walletType])

  // Check for existing wallet connections on mount
  useEffect(() => {
    const loadSavedWallets = () => {
      try {
        // In a real implementation, this would check for wallet extensions
        // and restore previous connections
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
      
      if (storedWalletType && hasYWalletExtension()) {
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
      // Clean up Y Wallet if it's connected
      if (wallet && walletType === 'zcash') {
        (wallet as YWalletImplementation).cleanup()
      }
      
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

  // Sign message with wallet
  const signMessage = async (message: string): Promise<string> => {
    if (!primaryWallet || !wallet) {
      throw new Error('No wallet connected')
    }
    
    if (walletType === 'zcash') {
      try {
        // Use Y Wallet's signing method
        const result = await (window.ywallet?.request({
          method: 'account.signMessage',
          params: {
            message,
            address: primaryWallet.address
          }
        }))
        
        return result.signature
      } catch (error: any) {
        console.error('Failed to sign message:', error)
        throw new Error(error.message || 'Failed to sign message')
      }
    } else {
      throw new Error('Wallet type not supported for signing')
    }
  }

  // Send ZEC function
  const sendZec = async (recipient: string, amount: number, memo?: string) => {
    if (!wallet || walletType !== 'zcash') {
      throw new Error('Zcash wallet not connected')
    }
    
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