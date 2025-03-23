"use client"

import React, { useState, useEffect, useCallback } from 'react'
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
  CheckCircle2,
  Clock,
  BadgeInfo,
  Check,
  ArrowRight,
  AlertTriangle
} from 'lucide-react'
import Image from 'next/image'

// Wallet provider information
const WalletProviders = [
  { 
    id: 'zcash-demo', 
    name: 'Demo Wallet', 
    icon: '/images/zcash-logo.png', 
    primary: true, 
    isDemo: true,
    description: 'Use a simulated wallet for testing and development purposes.'
  },
  { 
    id: 'zcash-ywallet', 
    name: 'Y Wallet', 
    icon: '/images/ywallet-logo.png', 
    comingSoon: true,
    description: 'A comprehensive Zcash wallet for mobile and desktop with shielded transactions support.'
  },
  { 
    id: 'zcash-zingo', 
    name: 'Zingo Wallet', 
    icon: '/images/zingo-logo.png', 
    comingSoon: true,
    description: 'A full-featured Zcash wallet with user-friendly interface for Android, iOS, and desktop.'
  },
  { 
    id: 'zcash-zashi', 
    name: 'Zashi Wallet', 
    icon: '/images/zashi-logo.png', 
    comingSoon: true,
    description: 'The official ECC Zcash wallet with enhanced privacy features and intuitive design.'
  },
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
  const [connecting, setConnecting] = useState(false)

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
    const wallet = WalletProviders.find(w => w.id === walletId)
    if (wallet && !wallet.disabled && !wallet.comingSoon) {
      setSelectedWallet(walletId)
      setConnectionStatus('idle')
      setErrorMessage('')
    }
  }

  const handleConnectWallet = async () => {
    if (!selectedWallet) {
      setErrorMessage('Please select a wallet provider')
      return
    }
    
    // Check if it's a "coming soon" wallet
    const walletProvider = WalletProviders.find(w => w.id === selectedWallet)
    if (walletProvider?.comingSoon) {
      setErrorMessage(`${walletProvider.name} integration is coming soon. Please use the Demo Wallet for now.`)
      return
    }
    
    setConnecting(true)
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
      setConnecting(false)
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
          
          {/* Demo Mode Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <span className="font-medium">Hackathon Demo Mode:</span> For this demo, use our Demo Wallet to experience the platform. Real wallet integrations coming soon.
            </div>
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
                    wallet.disabled || wallet.comingSoon
                      ? 'opacity-60 cursor-not-allowed border-white/10'
                      : selectedWallet === wallet.id 
                        ? 'border-accent-blue bg-accent-blue/10' 
                        : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => (!wallet.disabled && !wallet.comingSoon) && handleSelectWallet(wallet.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        wallet.id.includes('zcash') ? 'bg-[#F4B728] text-black' :
                        wallet.id === 'ethereum' ? 'bg-[#627EEA] text-white' :
                        wallet.id === 'near' ? 'bg-black text-white' :
                        wallet.id === 'base' ? 'bg-[#0052FF] text-white' :
                        'bg-gray-800 text-white'
                      }`}>
                        <Image 
                          src={wallet.icon} 
                          alt={wallet.name} 
                          width={28} 
                          height={28}
                          className={wallet.comingSoon ? 'opacity-50' : ''}
                        />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {wallet.name}
                          {wallet.isDemo && (
                            <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-sm">
                              DEMO
                            </span>
                          )}
                        </div>
                        {wallet.primary && (
                          <div className="text-xs text-accent-blue">Recommended for demo</div>
                        )}
                        {wallet.comingSoon && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Coming soon
                          </div>
                        )}
                        {wallet.disabled && (
                          <div className="text-xs text-gray-400">Coming soon</div>
                        )}
                        {wallet.description && (
                          <div className="text-xs text-gray-400 mt-1 max-w-[280px]">
                            {wallet.description}
                          </div>
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
                    Connect {selectedWallet?.includes('demo') ? 'Demo ' : ''}Wallet
                  </>
                )}
              </Button>
              
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