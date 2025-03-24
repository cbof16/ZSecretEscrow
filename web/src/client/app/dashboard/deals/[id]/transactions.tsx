"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, ArrowDown, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

import { TransactionMonitor } from '@/components/TransactionMonitor'
import { ZcashService, ZcashTransaction } from '@/services/zcash-service'
import { useWallet } from '@/lib/wallet-context'
import { Deal } from '@/services/escrow-service'

interface TransactionsTabProps {
  deal: Deal
}

export default function TransactionsTab({ deal }: TransactionsTabProps) {
  const { wallet } = useWallet()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<ZcashTransaction[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // Initialize Zcash service
  const zcashService = new ZcashService(wallet, '/api/zcash')
  
  // Load transaction history for this deal
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true)
        
        // In a real implementation, we would filter transactions by deal ID
        // For now, we'll use mock transactions from the service
        const txHistory = await zcashService.getTransactionHistory()
        
        // Sort by timestamp, newest first
        const sortedTxs = txHistory.sort((a, b) => b.timestamp - a.timestamp)
        
        setTransactions(sortedTxs)
      } catch (error) {
        console.error('Failed to load transactions:', error)
        toast({
          title: 'Error',
          description: 'Failed to load transaction history',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTransactions()
  }, [deal.id, zcashService, toast])
  
  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return true
    if (activeTab === 'deposits' && tx.memo?.toLowerCase().includes('escrow')) return true
    if (activeTab === 'releases' && tx.memo?.toLowerCase().includes('release')) return true
    return false
  })
  
  // Handle transaction refresh
  const handleRefreshTransaction = async (txid: string) => {
    try {
      const updatedTx = await zcashService.getTransactionStatus(txid)
      
      // Update the transaction in the list
      setTransactions(prev => 
        prev.map(tx => tx.txid === txid ? updatedTx : tx)
      )
      
      return updatedTx
    } catch (error) {
      console.error(`Failed to refresh transaction ${txid}:`, error)
      throw error
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl">Transactions</CardTitle>
            <CardDescription>
              On-chain transactions related to this escrow deal
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className="bg-blue-100 text-blue-800 border-blue-300 self-start sm:self-auto"
          >
            {wallet.isDemo ? 'Demo Mode' : 'Shielded Transactions'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="releases">Releases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse text-muted-foreground" />
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map(tx => (
                  <TransactionMonitor
                    key={tx.txid}
                    transaction={tx}
                    onRefresh={() => handleRefreshTransaction(tx.txid)}
                    isDemoMode={wallet.isDemo}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No transactions found for this deal</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deposits" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse text-muted-foreground" />
                <p className="text-muted-foreground">Loading deposit transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map(tx => (
                  <TransactionMonitor
                    key={tx.txid}
                    transaction={tx}
                    onRefresh={() => handleRefreshTransaction(tx.txid)}
                    isDemoMode={wallet.isDemo}
                    serviceName="Escrow Deposit"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <ArrowDown className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No deposit transactions found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="releases" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse text-muted-foreground" />
                <p className="text-muted-foreground">Loading release transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map(tx => (
                  <TransactionMonitor
                    key={tx.txid}
                    transaction={tx}
                    onRefresh={() => handleRefreshTransaction(tx.txid)}
                    isDemoMode={wallet.isDemo}
                    serviceName="Fund Release"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <ArrowRight className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No release transactions found yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Funds will be released when the deal is completed
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-xs text-muted-foreground">
          <p className="flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
            Transactions are {wallet.isDemo ? 'simulated in demo mode' : 'verified on the Zcash blockchain'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 