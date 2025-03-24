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
  CheckCircle2,
  TestTube2,
  Clock
} from 'lucide-react'

// Wallet provider information
const WalletProviders = [
  { id: 'zcash', name: 'Demo Wallet (Zcash)', icon: 'Z', primary: true, isDemo: true },
  { id: 'ywallet', name: 'Y Wallet', icon: 'Y', disabled: true, comingSoon: true },
  { id: 'zingo', name: 'Zingo Wallet', icon: 'ZG', disabled: true, comingSoon: true },
  { id: 'zashi', name: 'Zashi', icon: 'ZS', disabled: true, comingSoon: true },
  { id: 'ethereum', name: 'MetaMask', icon: 'ETH', disabled: true },
  { id: 'near', name: 'NEAR', icon: 'N', disabled: true },
]

export default function ConnectWalletPage() {
  const router = useRouter()
  const { connectWallet, isConnecting, isAuthenticated, error, isDemo } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>('zcash') // Default to demo wallet
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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
    
    setConnectionStatus('connecting')
    setErrorMessage('')
    
    try {
      console.log('Attempting to connect wallet:', selectedWallet)
      if (selectedWallet === 'zcash') {
        await connectWallet('zcash')
      } else {
        throw new Error('This wallet implementation is coming soon')
      }
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
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              Connect your cryptocurrency wallet to start using ZSecretEscrow's secure and private escrow services.
            </p>
            
            <div className="inline-flex items-center mt-4 bg-purple-900/30 text-purple-300 px-3 py-1.5 rounded-full text-sm border border-purple-600/50">
              <TestTube2 className="w-4 h-4 mr-1.5" />
              <span>Demo Mode Active</span>
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
                For this demo, use our simulated wallet for testing. Real wallet integrations coming soon.
              </p>
            </div>
            
            <div className="space-y-3">
              {WalletProviders.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover-lift ${
                    wallet.disabled 
                      ? 'opacity-60 cursor-not-allowed border-white/10'
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
                        wallet.id === 'ywallet' ? 'bg-[#6A8FFF] text-white' :
                        wallet.id === 'zingo' ? 'bg-[#1A4C71] text-white' :
                        wallet.id === 'zashi' ? 'bg-[#6741D9] text-white' :
                        wallet.id === 'ethereum' ? 'bg-[#627EEA] text-white' :
                        wallet.id === 'near' ? 'bg-black text-white' :
                        'bg-gray-800 text-white'
                      }`}>
                        {wallet.icon}
                      </div>
                      <div>
                        <div className="font-medium flex items-center">
                          {wallet.name}
                          {wallet.isDemo && (
                            <span className="ml-2 text-xs py-0.5 px-1.5 bg-purple-800/60 text-purple-200 rounded-sm">
                              DEMO
                            </span>
                          )}
                        </div>
                        {wallet.primary && (
                          <div className="text-xs text-accent-blue">Recommended for testing</div>
                        )}
                        {wallet.comingSoon && (
                          <div className="text-xs text-amber-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Coming soon
                          </div>
                        )}
                        {wallet.disabled && !wallet.comingSoon && (
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
                    Connect Demo Wallet
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
            className="glass-card p-6 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                <TestTube2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Demo Mode Information</h3>
                <p className="text-sm text-gray-300 mb-3">
                  This demo uses a simulated Zcash wallet for demonstration purposes. No real blockchain transactions will be made.
                </p>
                <div className="text-sm text-gray-400">
                  <p>Upcoming wallet implementations:</p>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>Y Wallet - Browser extension for Zcash</li>
                    <li>Zingo Wallet - Desktop & mobile wallet</li>
                    <li>Zashi - Mobile wallet for Zcash</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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