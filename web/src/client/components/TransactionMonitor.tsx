import React, { useEffect, useState } from 'react'
import { ExternalLink, Clock, CheckCircle, AlertTriangle, Loader2, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ZcashTransaction, TransactionStatus } from '@/services/zcash-service'

interface TransactionMonitorProps {
  transaction: ZcashTransaction | null
  serviceName?: string
  refreshInterval?: number // in milliseconds
  onRefresh?: () => Promise<ZcashTransaction>
  isDemoMode?: boolean
}

export function TransactionMonitor({
  transaction,
  serviceName = 'Zcash',
  refreshInterval = 15000,
  onRefresh,
  isDemoMode = false
}: TransactionMonitorProps) {
  const [currentTx, setCurrentTx] = useState<ZcashTransaction | null>(transaction)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refresh transaction status at interval
  useEffect(() => {
    if (!transaction || !onRefresh) return
    
    setCurrentTx(transaction)
    
    const intervalId = setInterval(async () => {
      if (transaction.status === 'confirmed') {
        clearInterval(intervalId)
        return
      }
      
      try {
        setIsLoading(true)
        const updatedTx = await onRefresh()
        setCurrentTx(updatedTx)
        setError(null)
        
        // If confirmed, stop polling
        if (updatedTx.status === 'confirmed') {
          clearInterval(intervalId)
        }
      } catch (err) {
        setError('Failed to refresh transaction status')
        console.error('Transaction refresh error:', err)
      } finally {
        setIsLoading(false)
      }
    }, refreshInterval)
    
    return () => clearInterval(intervalId)
  }, [transaction, onRefresh, refreshInterval])
  
  // Format transaction amount
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    })
  }
  
  // Get explorer URL based on transaction
  const getExplorerUrl = (tx: ZcashTransaction): string => {
    if (isDemoMode) {
      return '#'
    }
    // For Zcash mainnet (customize as needed)
    return `https://explorer.zcha.in/transactions/${tx.txid}`
  }
  
  // Get status text and color
  const getStatusInfo = (status: TransactionStatus): { text: string; color: string; icon: React.ReactNode } => {
    switch (status) {
      case 'pending':
        return { 
          text: 'Pending', 
          color: 'bg-yellow-500',
          icon: <Clock className="h-4 w-4" />
        }
      case 'confirmed':
        return { 
          text: 'Confirmed', 
          color: 'bg-green-500',
          icon: <CheckCircle className="h-4 w-4" />
        }
      case 'failed':
        return { 
          text: 'Failed', 
          color: 'bg-red-500',
          icon: <AlertTriangle className="h-4 w-4" />
        }
      default:
        return { 
          text: 'Unknown', 
          color: 'bg-gray-500',
          icon: <AlertTriangle className="h-4 w-4" />
        }
    }
  }
  
  // Calculate confirmation progress
  const getConfirmationProgress = (confirmations: number): number => {
    // Consider 12 confirmations as 100% for Zcash
    const target = 12
    return Math.min(Math.round((confirmations / target) * 100), 100)
  }
  
  // Format demo badge
  const DemoBadge = () => (
    <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
      Demo
    </Badge>
  )
  
  if (!currentTx) {
    return null
  }
  
  const statusInfo = getStatusInfo(currentTx.status)
  const explorerUrl = getExplorerUrl(currentTx)
  const progress = getConfirmationProgress(currentTx.confirmations)
  
  return (
    <Card className="w-full shadow-sm border-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {serviceName} Transaction
              {isDemoMode && <DemoBadge />}
            </CardTitle>
            <CardDescription>
              {currentTx.isShielded ? 'Shielded Transaction' : 'Transparent Transaction'}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isDemoMode}
                  onClick={() => window.open(explorerUrl, '_blank')}
                  className="h-8"
                >
                  Explorer <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on {serviceName} Explorer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Transaction ID</p>
              <p className="text-sm font-mono break-all">
                {currentTx.txid.substring(0, 16)}...
                {currentTx.txid.substring(currentTx.txid.length - 8)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Amount</p>
              <p className="text-base font-semibold">
                {formatAmount(currentTx.amount)} ZEC
              </p>
            </div>
          </div>
          
          <div className="pt-1">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Badge className={`${statusInfo.color} text-white flex items-center gap-1`}>
                  {statusInfo.icon} {statusInfo.text}
                </Badge>
                {isLoading && (
                  <span className="ml-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentTx.confirmations} confirmation{currentTx.confirmations !== 1 ? 's' : ''}
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {currentTx.memo && (
            <div className="pt-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">Memo</p>
              <p className="text-sm">{currentTx.memo}</p>
            </div>
          )}
          
          {error && (
            <div className="pt-1">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {new Date(currentTx.timestamp).toLocaleString()}
          </span>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2"
              onClick={async () => {
                if (isLoading) return
                try {
                  setIsLoading(true)
                  const updatedTx = await onRefresh()
                  setCurrentTx(updatedTx)
                  setError(null)
                } catch (err) {
                  setError('Failed to refresh')
                  console.error('Manual refresh error:', err)
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
} 