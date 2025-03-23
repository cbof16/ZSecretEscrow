"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { useWallet, WalletType } from '@/lib/wallet-context'
import { 
  Shield, 
  Wallet, 
  AlertCircle,
  ChevronRight,
  Loader2,
  CheckCircle2
} from 'lucide-react'

// Wallet provider information
const WalletProviders = [
  { id: 'zcash', name: 'Y Wallet (Zcash)', icon: 'Z', primary: true },
  { id: 'ethereum', name: 'MetaMask', icon: 'ETH', disabled: true },
  { id: 'near', name: 'NEAR', icon: 'N', disabled: true },
  { id: 'base', name: 'Base Wallet', icon: 'B', disabled: true },
]

export default function ConnectWalletPage() {
  const router = useRouter()
  const { connectWallet, isConnecting, isAuthenticated, error } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [walletInstalled, setWalletInstalled] = useState(false)

  // Check if Y Wallet extension is installed
  useEffect(() => {
    const checkWalletExtension = () => {
      const hasYWallet = typeof window !== 'undefined' && !!window.ywallet
      console.log('Y Wallet extension detected:', hasYWallet)
      setWalletInstalled(hasYWallet)
    }
    
    checkWalletExtension()
    // Recheck every 2 seconds in case user installs extension
    const intervalId = setInterval(checkWalletExtension, 2000)
    
    return () => clearInterval(intervalId)
  }, [])

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Update status based on wallet context
  useEffect(() => {
    if (isConnecting) {
      setConnectionStatus('connecting')
    } else if (error) {
      setConnectionStatus('error')
      setErrorMessage(error)
    }
  }, [isConnecting, error])

  const handleSelectWallet = (walletId: string) => {
    setSelectedWallet(walletId)
    setConnectionStatus('idle')
    setErrorMessage('')
  }

  const handleConnectWallet = async () => {
    if (!selectedWallet) return
    
    // Check if wallet is installed for Zcash
    if (selectedWallet === 'zcash' && !walletInstalled) {
      setConnectionStatus('error')
      setErrorMessage('Y Wallet extension not detected. Please install it first.')
      return
    }
    
    setConnectionStatus('connecting')
    setErrorMessage('')
    
    try {
      console.log('Attempting to connect wallet:', selectedWallet)
      await connectWallet(selectedWallet as WalletType)
      console.log('Wallet connected successfully')
      setConnectionStatus('connected')
      
      // Wait a moment before redirecting to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error: any) {
      console.error('Connect wallet error:', error)
      setConnectionStatus('error')
      setErrorMessage(error.message || 'Failed to connect wallet')
    }
  }

  return (
    <main className="min-h-screen bg-background mesh-gradient">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              Connect your cryptocurrency wallet to start using ZSecretEscrow's secure and private escrow services.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 mb-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Select a Wallet</h2>
              <p className="text-gray-300 text-sm">
                Connect with your preferred wallet to access the platform.
              </p>
            </div>
            
            <div className="space-y-3">
              {WalletProviders.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover-lift ${
                    wallet.disabled 
                      ? 'opacity-50 cursor-not-allowed border-white/10'
                      : selectedWallet === wallet.id 
                        ? 'border-accent-blue bg-accent-blue/10' 
                        : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => !wallet.disabled && handleSelectWallet(wallet.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        wallet.id === 'zcash' ? 'bg-[#F4B728] text-black' :
                        wallet.id === 'ethereum' ? 'bg-[#627EEA] text-white' :
                        wallet.id === 'near' ? 'bg-black text-white' :
                        wallet.id === 'base' ? 'bg-[#0052FF] text-white' :
                        'bg-gray-800 text-white'
                      }`}>
                        {wallet.icon}
                      </div>
                      <div>
                        <div className="font-medium">{wallet.name}</div>
                        {wallet.primary && (
                          <div className="text-xs text-accent-blue">Recommended</div>
                        )}
                        {wallet.disabled && (
                          <div className="text-xs text-gray-400">Coming soon</div>
                        )}
                      </div>
                    </div>
                    <div>
                      {selectedWallet === wallet.id && (
                        <div className="w-4 h-4 rounded-full bg-accent-blue"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button
                className="w-full bg-accent-blue hover:bg-accent-blue/80 flex items-center justify-center gap-2"
                size="lg"
                onClick={handleConnectWallet}
                disabled={!selectedWallet || connectionStatus === 'connecting' || (selectedWallet && WalletProviders.find(w => w.id === selectedWallet)?.disabled)}
              >
                {connectionStatus === 'connecting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : connectionStatus === 'connected' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Connected
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
              
              {!walletInstalled && selectedWallet === 'zcash' && (
                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p>Y Wallet extension not detected. Please install it first.</p>
                    <a 
                      href="https://ywallet.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:underline"
                    >
                      Download Y Wallet
                    </a>
                  </div>
                </div>
              )}
              
              {connectionStatus === 'error' && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-accent-blue/10 text-accent-blue">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Secure Connection</h3>
                <p className="text-sm text-gray-300 mb-3">
                  ZSecretEscrow never stores your private keys and all connections are end-to-end encrypted.
                </p>
                <Link href="#" className="text-accent-blue text-sm inline-flex items-center gap-1 hover:underline">
                  Learn more about our security
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 