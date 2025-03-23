"use client"

import React, { useState } from 'react'
import { useWallet, WalletType } from '@/lib/wallet-context'
import { ArrowLeft, Shield, Info, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FormState {
  title: string
  description: string
  amount: string
  counterpartyAddress: string
  counterpartyType: WalletType
  milestones: boolean
  milestoneCount: number
}

export default function CreateDealPage() {
  const { primaryWallet } = useWallet()
  const router = useRouter()
  
  const [formState, setFormState] = useState<FormState>({
    title: '',
    description: '',
    amount: '',
    counterpartyAddress: '',
    counterpartyType: 'zcash',
    milestones: false,
    milestoneCount: 1
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormState(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormState(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Here we would submit the form data to our backend
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Failed to create deal:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <div className="mb-8">
        <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-1 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        
        <h1 className="text-2xl font-bold">Create New Escrow Deal</h1>
        <p className="text-gray-400 mt-1">Set up a secure transaction with another party</p>
      </div>
      
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-accent-blue' : 'bg-gray-700'}`}>
              <span className="text-white font-medium">1</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-accent-blue' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-accent-blue' : 'bg-gray-700'}`}>
              <span className="text-white font-medium">2</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-accent-blue' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-accent-blue' : 'bg-gray-700'}`}>
              <span className="text-white font-medium">3</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Deal Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Deal Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formState.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-dark border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="e.g. Website Development"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-navy-dark border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Describe what this deal is for..."
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                    Amount (ZEC)
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formState.amount}
                    onChange={handleInputChange}
                    required
                    step="0.0001"
                    min="0.0001"
                    className="w-full bg-navy-dark border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Counterparty Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Counterparty Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="counterpartyType" className="block text-sm font-medium text-gray-300 mb-1">
                    Wallet Type
                  </label>
                  <select
                    id="counterpartyType"
                    name="counterpartyType"
                    value={formState.counterpartyType}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-dark border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                  >
                    <option value="zcash">Zcash</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="near">NEAR</option>
                    <option value="base">Base</option>
                    <option value="polygon">Polygon</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="counterpartyAddress" className="block text-sm font-medium text-gray-300 mb-1">
                    Counterparty Address
                  </label>
                  <input
                    id="counterpartyAddress"
                    name="counterpartyAddress"
                    type="text"
                    value={formState.counterpartyAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-dark border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="Enter wallet address"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the wallet address of the other party in this transaction.
                  </p>
                </div>
                
                <div className="bg-navy-dark/80 p-4 rounded-lg border border-accent-blue/20">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-accent-blue mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-white">Privacy Protection</p>
                      <p className="text-xs text-gray-400 mt-1">
                        All transactions on ZSecretEscrow are protected with enhanced privacy features. Your identity is shielded from public view.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Deal Confirmation</h2>
              
              {!isSuccess ? (
                <div className="space-y-6">
                  <div className="bg-navy-dark/80 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Deal Title</h3>
                        <p className="font-medium">{formState.title}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Amount</h3>
                        <p className="font-medium">{formState.amount} ZEC</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Your Wallet</h3>
                        <p className="font-medium">{primaryWallet?.shortAddress}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Counterparty</h3>
                        <p className="font-medium">{formState.counterpartyAddress.substring(0, 10)}...</p>
                      </div>
                    </div>
                    
                    {formState.description && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-400">Description</h3>
                        <p className="text-sm mt-1">{formState.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-navy-dark/80 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-accent-blue mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Escrow Security</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Funds will be held in a secure smart contract escrow until both parties confirm the transaction is complete. A small fee of 0.5% will be applied.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-blue/10 mb-4">
                    <CheckCircle className="w-8 h-8 text-accent-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Deal Created Successfully!</h3>
                  <p className="text-gray-400">
                    Your escrow deal has been set up. You'll be redirected to your dashboard.
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                Back
              </Button>
            ) : (
              <div></div> 
            )}
            
            {currentStep < 3 ? (
              <Button type="button" onClick={handleNextStep}>
                Continue
              </Button>
            ) : (
              !isSuccess && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Deal'}
                </Button>
              )
            )}
          </div>
        </form>
      </div>
    </>
  )
} 