"use client"

import React, { useState, useEffect } from 'react'
import { useWallet } from '@/lib/wallet-context'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare,
  FileText,
  Shield,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EscrowService, Deal, DealStatus } from '@/services/escrow-service'
import { formatDate, formatRelativeTime, truncateString } from '@/lib/utils'

export default function DealDetailsPage({ params }: { params: { id: string } }) {
  const { userProfile, wallet } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMessages, setShowMessages] = useState(true)
  const [showDocuments, setShowDocuments] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  
  // Determine if user is the deal creator or counterparty
  const isCreator = deal?.counterparty !== userProfile?.primaryWallet.address
  const userRole = isCreator ? 'Client' : 'Freelancer'
  
  useEffect(() => {
    const fetchDealDetails = async () => {
      if (!wallet) {
        router.push('/connect-wallet')
        return
      }
      
      setLoading(true)
      try {
        const escrowService = new EscrowService(wallet)
        const dealData = await escrowService.getDealById(params.id)
        
        if (!dealData) {
          setError('Deal not found')
        } else {
          setDeal(dealData)
        }
      } catch (err: any) {
        console.error('Failed to fetch deal details:', err)
        setError(err.message || 'Failed to fetch deal details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDealDetails()
  }, [params.id, wallet, router])
  
  const getStatusColor = (status: DealStatus) => {
    switch(status) {
      case 'active': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'completed': return 'text-blue-400'
      case 'disputed': return 'text-red-400'
      case 'cancelled': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }
  
  const getStatusIcon = (status: DealStatus) => {
    switch(status) {
      case 'active': return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-blue-400" />
      case 'disputed': return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'cancelled': return <X className="w-5 h-5 text-gray-400" />
      default: return null
    }
  }
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !wallet || !deal) return
    
    setSendingMessage(true)
    try {
      const escrowService = new EscrowService(wallet)
      const { messageId } = await escrowService.addMessage(deal.id, newMessage)
      
      // Optimistically update UI
      const updatedDeal = { 
        ...deal,
        messages: [
          ...(deal.messages || []),
          {
            id: messageId,
            sender: userProfile?.primaryWallet.shortAddress || 'You',
            content: newMessage,
            timestamp: new Date().toISOString(),
            isRead: false
          }
        ]
      }
      
      setDeal(updatedDeal)
      setNewMessage('')
      toast({
        title: 'Message sent',
        description: 'Your message has been sent to the other party.',
      })
    } catch (err: any) {
      console.error('Failed to send message:', err)
      toast({
        title: 'Failed to send message',
        description: err.message || 'There was an error sending your message',
        variant: 'destructive'
      })
    } finally {
      setSendingMessage(false)
    }
  }
  
  const handleReleaseFunds = async () => {
    if (!wallet || !deal) return
    
    setProcessingAction(true)
    try {
      const escrowService = new EscrowService(wallet)
      const { txid } = await escrowService.releaseFunds(deal.id)
      
      // Optimistically update UI
      const updatedDeal = { 
        ...deal,
        status: 'completed' as DealStatus,
        timeline: [
          ...(deal.timeline || []),
          {
            date: new Date().toISOString(),
            event: 'Funds released',
            actor: userRole
          }
        ]
      }
      
      setDeal(updatedDeal)
      toast({
        title: 'Funds released',
        description: 'The funds have been successfully released to the counterparty.',
      })
    } catch (err: any) {
      console.error('Failed to release funds:', err)
      toast({
        title: 'Failed to release funds',
        description: err.message || 'There was an error releasing the funds',
        variant: 'destructive'
      })
    } finally {
      setProcessingAction(false)
    }
  }
  
  const handleRaiseDispute = async () => {
    if (!wallet || !deal) return
    
    setProcessingAction(true)
    try {
      const escrowService = new EscrowService(wallet)
      const reason = 'Dispute initiated by ' + userRole // In a real app, you'd have a form for this
      const { disputeId } = await escrowService.raiseDispute(deal.id, reason)
      
      // Optimistically update UI
      const updatedDeal = { 
        ...deal,
        status: 'disputed' as DealStatus,
        timeline: [
          ...(deal.timeline || []),
          {
            date: new Date().toISOString(),
            event: 'Dispute raised',
            actor: userRole
          }
        ]
      }
      
      setDeal(updatedDeal)
      toast({
        title: 'Dispute raised',
        description: 'Your dispute has been submitted and is under review.',
      })
    } catch (err: any) {
      console.error('Failed to raise dispute:', err)
      toast({
        title: 'Failed to raise dispute',
        description: err.message || 'There was an error raising the dispute',
        variant: 'destructive'
      })
    } finally {
      setProcessingAction(false)
    }
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }
  
  const handleFileUpload = async () => {
    if (!selectedFiles.length || !wallet || !deal) return
    
    setUploading(true)
    try {
      const escrowService = new EscrowService(wallet)
      const uploadPromises = selectedFiles.map(file => 
        escrowService.uploadDocument(deal.id, file)
      )
      
      const results = await Promise.all(uploadPromises)
      
      // Optimistically update UI
      const newDocuments = results.map((result, index) => ({
        id: result.documentId,
        name: selectedFiles[index].name,
        size: `${(selectedFiles[index].size / 1024).toFixed(1)} KB`,
        uploadedBy: userProfile?.primaryWallet.shortAddress || 'You',
        uploadedAt: new Date().toISOString(),
        url: result.url
      }))
      
      const updatedDeal = { 
        ...deal,
        documents: [
          ...(deal.documents || []),
          ...newDocuments
        ]
      }
      
      setDeal(updatedDeal)
      setSelectedFiles([])
      toast({
        title: 'Documents uploaded',
        description: `Successfully uploaded ${results.length} document(s).`,
      })
    } catch (err: any) {
      console.error('Failed to upload documents:', err)
      toast({
        title: 'Failed to upload documents',
        description: err.message || 'There was an error uploading the documents',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-accent-blue" />
          <p className="text-gray-400">Loading deal details...</p>
        </div>
      </div>
    )
  }
  
  if (error || !deal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold mb-2">Failed to load deal</h2>
          <p className="text-gray-400 mb-6">{error || 'Deal not found'}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link href="/dashboard/deals" className="text-gray-400 hover:text-white flex items-center gap-1 text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Deals</span>
          </Link>
          <h1 className="text-2xl font-bold">{deal.title}</h1>
          <div className="flex items-center mt-1">
            <span className={`flex items-center gap-1 ${getStatusColor(deal.status)}`}>
              {getStatusIcon(deal.status)}
              <span className="capitalize">{deal.status}</span>
            </span>
            <span className="mx-2 text-gray-600">•</span>
            <span className="text-gray-400">Created {formatRelativeTime(deal.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          {deal.status === 'active' && (
            <Button 
              variant="outline" 
              className="text-red-400 border-red-400/20 hover:bg-red-400/10"
              onClick={handleRaiseDispute}
              disabled={processingAction}
            >
              {processingAction ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Raise Dispute
            </Button>
          )}
          {deal.status === 'active' && isCreator && (
            <Button 
              className="bg-accent-blue hover:bg-accent-blue/80"
              onClick={handleReleaseFunds}
              disabled={processingAction}
            >
              {processingAction ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Release Funds
            </Button>
          )}
        </div>
      </div>
      
      {/* Deal Information */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Left column - Deal details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Deal Details</h2>
            
            {deal.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                <p className="text-sm">{deal.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  {isCreator ? 'Client (You)' : 'Client'}
                </h3>
                <p className="font-medium">
                  {isCreator ? userProfile?.primaryWallet.shortAddress : deal.counterpartyName || 'Client'}
                </p>
                <p className="text-sm text-gray-400">
                  {isCreator ? userProfile?.primaryWallet.shortAddress : deal.counterparty}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  {!isCreator ? 'Freelancer (You)' : 'Freelancer'}
                </h3>
                <p className="font-medium">
                  {!isCreator ? userProfile?.primaryWallet.shortAddress : deal.counterpartyName || 'Freelancer'}
                </p>
                <p className="text-sm text-gray-400">
                  {!isCreator ? userProfile?.primaryWallet.shortAddress : deal.counterparty}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Amount</h3>
                <p className="font-medium">{deal.amount} ZEC</p>
                {deal.amountUsd && <p className="text-sm text-gray-400">${deal.amountUsd}</p>}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Created on</h3>
                <p className="font-medium">{formatDate(deal.createdAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Progress & Timeline */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Progress & Timeline</h2>
            
            {deal.status === 'active' && deal.progress !== undefined && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span className="font-medium">{deal.progress}%</span>
                </div>
                <div className="h-2 bg-navy-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-blue rounded-full" 
                    style={{ width: `${deal.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {deal.timeline && deal.timeline.length > 0 ? (
              <div className="space-y-4">
                {deal.timeline.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-accent-blue/20 text-accent-blue">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-gray-400">
                        {formatDate(item.date)}
                        {item.actor && <span> • {item.actor}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No timeline events yet</p>
            )}
          </div>
          
          {/* Messages */}
          <div className="glass-card p-6">
            <button 
              onClick={() => setShowMessages(!showMessages)} 
              className="w-full flex items-center justify-between text-lg font-semibold mb-4"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent-blue" />
                <span>Messages</span>
                {!showMessages && deal.messages && deal.messages.length > 0 && (
                  <span className="text-sm text-gray-400">({deal.messages.length})</span>
                )}
              </div>
              {showMessages ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            {showMessages && (
              <div className="space-y-4 mt-2">
                {deal.messages && deal.messages.length > 0 ? (
                  deal.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg ${
                        message.sender === userProfile?.primaryWallet.shortAddress 
                          ? 'bg-accent-blue/10 ml-8' 
                          : 'bg-navy-dark/80 mr-8'
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {message.sender === userProfile?.primaryWallet.shortAddress ? 'You' : message.sender}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm mb-4">No messages yet</p>
                )}
                
                <div className="pt-4">
                  <textarea
                    placeholder="Type your message..."
                    className="w-full bg-navy-dark border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent mb-2"
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sendingMessage}
                  />
                  <div className="flex justify-end">
                    <Button 
                      className="bg-accent-blue hover:bg-accent-blue/80"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                    >
                      {sendingMessage ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Documents */}
          <div className="glass-card p-6">
            <button 
              onClick={() => setShowDocuments(!showDocuments)} 
              className="w-full flex items-center justify-between text-lg font-semibold mb-4"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-blue" />
                <span>Documents</span>
                {!showDocuments && deal.documents && deal.documents.length > 0 && (
                  <span className="text-sm text-gray-400">({deal.documents.length})</span>
                )}
              </div>
              {showDocuments ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            {showDocuments && (
              <div className="space-y-4 mt-2">
                {deal.documents && deal.documents.length > 0 ? (
                  deal.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-navy-dark/80 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-accent-blue mr-3" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-400">
                            {doc.size} • Uploaded by {
                              doc.uploadedBy === userProfile?.primaryWallet.shortAddress 
                                ? 'You' 
                                : truncateString(doc.uploadedBy, 10)
                            } • {formatRelativeTime(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={doc.url} target="_blank" rel="noopener noreferrer">
                          Download
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm mb-4">No documents uploaded yet</p>
                )}
                
                <div className="pt-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileSelect}
                      multiple
                    />
                    <label
                      htmlFor="file-upload"
                      className={`w-full cursor-pointer border border-dashed border-gray-700 rounded-md py-8 px-4 flex flex-col items-center justify-center ${
                        selectedFiles.length > 0 ? 'bg-accent-blue/10 border-accent-blue' : ''
                      }`}
                    >
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="block font-medium">
                        {selectedFiles.length > 0 
                          ? `${selectedFiles.length} file(s) selected` 
                          : 'Upload Document'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {selectedFiles.length > 0 
                          ? selectedFiles.map(f => f.name).join(', ')
                          : 'Click to browse or drop files here'}
                      </span>
                    </label>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          className="bg-accent-blue hover:bg-accent-blue/80"
                          onClick={handleFileUpload}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : 'Upload Files'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Security & Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-start mb-4">
              <Shield className="w-5 h-5 text-accent-blue mr-2 mt-0.5" />
              <h2 className="text-lg font-semibold">Escrow Security</h2>
            </div>
            
            <div className="space-y-4 text-sm">
              <p>
                This transaction is secured with ZSecretEscrow's secure escrow protocol. Funds are held in a secure smart contract until both parties confirm completion.
              </p>
              
              <div className="bg-navy-dark/80 p-3 rounded-lg">
                <div className="font-medium mb-1">Transaction ID</div>
                <div className="text-xs text-gray-400 break-all">
                  {/* This would come from the real transaction */}
                  0x7ac21e1fd8a9d1cee25d982341a65da37b7123c96df8be9367c7f639f0345900
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Security Features</div>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>End-to-end encryption</li>
                  <li>Multisig authorization</li>
                  <li>Time-locked escrow</li>
                  <li>Dispute resolution</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            
            <div className="space-y-3">
              {deal.status === 'active' && isCreator && (
                <>
                  <Button 
                    className="w-full bg-accent-blue hover:bg-accent-blue/80"
                    onClick={handleReleaseFunds}
                    disabled={processingAction}
                  >
                    {processingAction ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Release Payment
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Milestone Update
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10"
                    onClick={handleRaiseDispute}
                    disabled={processingAction}
                  >
                    {processingAction ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Raise Dispute
                  </Button>
                </>
              )}
              
              {deal.status === 'active' && !isCreator && (
                <>
                  <Button variant="outline" className="w-full">
                    Submit Milestone
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10"
                    onClick={handleRaiseDispute}
                    disabled={processingAction}
                  >
                    {processingAction ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Raise Dispute
                  </Button>
                </>
              )}
              
              {deal.status === 'pending' && (
                <>
                  <Button className="w-full bg-accent-blue hover:bg-accent-blue/80">
                    Approve Deal
                  </Button>
                  <Button variant="outline" className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10">
                    Reject Deal
                  </Button>
                </>
              )}
              
              {deal.status === 'completed' && (
                <Button variant="outline" className="w-full">
                  View Transaction
                </Button>
              )}
              
              {deal.status === 'disputed' && (
                <>
                  <Button className="w-full bg-accent-blue hover:bg-accent-blue/80">
                    View Dispute Details
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 