"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Clock, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Wallet 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/lib/wallet-context'
import { EscrowService, Deal } from '@/services/escrow-service'
import { formatNumber, truncateString } from '@/lib/utils'

export default function DashboardPage() {
  const { userProfile, wallet } = useWallet()
  const [copySuccess, setCopySuccess] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchDeals = async () => {
      if (wallet) {
        try {
          const escrowService = new EscrowService(wallet)
          const fetchedDeals = await escrowService.getDeals()
          setDeals(fetchedDeals)
        } catch (err: any) {
          console.error('Failed to fetch deals:', err)
          setError(err.message || 'Failed to fetch deals')
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchDeals()
  }, [wallet])

  // Helper function to get the appropriate status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'completed':
        return 'text-blue-400'
      case 'disputed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  // Helper function to get the appropriate status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'disputed':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (!userProfile) return
    
    navigator.clipboard.writeText(userProfile.primaryWallet.address)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }
  
  // Calculate dashboard statistics
  const stats = {
    activeDeals: deals.filter(deal => deal.status === 'active').length,
    pendingDeals: deals.filter(deal => deal.status === 'pending').length,
    completedDeals: deals.filter(deal => deal.status === 'completed').length,
    totalValue: deals.reduce((total, deal) => total + deal.amount, 0)
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-accent-blue" />
          <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
          <p className="mb-6 text-gray-300">Please connect your wallet to view your dashboard.</p>
          <Link href="/connect-wallet">
            <Button className="bg-accent-blue hover:bg-accent-blue/80">
              Connect Wallet
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/deals/create">
          <Button className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/80">
            <Plus className="w-4 h-4" />
            Create Deal
          </Button>
        </Link>
      </div>
      
      {/* Wallet Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm text-gray-400">Address:</div>
              <div className="flex items-center gap-2">
                <span>{userProfile.primaryWallet.shortAddress}</span>
                <button 
                  onClick={copyAddress} 
                  className="text-accent-blue hover:text-accent-blue/80 rounded-full focus:outline-none"
                >
                  {copySuccess ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-sm text-gray-400 mb-1">Available Balance:</div>
                <div className="text-xl font-semibold">{userProfile.primaryWallet.balance.available} ZEC</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">In Escrow:</div>
                <div className="text-xl font-semibold">{stats.totalValue.toFixed(2)} ZEC</div>
              </div>
            </div>
          </div>
          <div className="md:text-right">
            <Button variant="outline" size="sm">
              View Transactions
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Active Deals</div>
                <div className="text-2xl font-semibold">{stats.activeDeals}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Pending Deals</div>
                <div className="text-2xl font-semibold">{stats.pendingDeals}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Completed Deals</div>
                <div className="text-2xl font-semibold">{stats.completedDeals}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Value</div>
                <div className="text-2xl font-semibold">{stats.totalValue.toFixed(2)} ZEC</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-blue" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Recent Deals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Deals</h2>
          <Link href="/dashboard/deals" className="text-accent-blue hover:underline text-sm flex items-center">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="glass-card p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-400">Loading your deals...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Deals</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        ) : deals.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No Deals Yet</h3>
            <p className="text-gray-400 mb-4">You haven't created any escrow deals yet.</p>
            <Link href="/dashboard/deals/create">
              <Button className="bg-accent-blue hover:bg-accent-blue/80">
                Create Your First Deal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-card p-6 hover:border-accent-blue/30 transition-all"
              >
                <Link href={`/dashboard/deals/${deal.id}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-opacity-10 ${getStatusColor(deal.status)} bg-${deal.status}-400/10`}>
                          {getStatusIcon(deal.status)}
                          <span className="capitalize">{deal.status}</span>
                        </span>
                        <span className="text-sm text-gray-400">
                          Created {new Date(deal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{deal.title}</h3>
                      {deal.description && (
                        <p className="text-sm text-gray-300">{truncateString(deal.description, 100)}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-semibold">{deal.amount} ZEC</div>
                      {deal.amountUsd && (
                        <div className="text-sm text-gray-400">${formatNumber(deal.amountUsd)}</div>
                      )}
                    </div>
                  </div>
                  {deal.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{deal.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-blue rounded-full" 
                          style={{ width: `${deal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 