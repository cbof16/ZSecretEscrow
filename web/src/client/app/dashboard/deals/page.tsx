"use client"

import React, { useState } from 'react'
import { useWallet } from '@/lib/wallet-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Deal {
  id: string
  title: string
  status: 'active' | 'pending' | 'completed' | 'disputed'
  amount: string
  amountUsd: string
  counterparty: string
  counterpartyName: string
  createdAt: string
  progress?: number
  description?: string
}

type SortField = 'createdAt' | 'amount' | 'title'
type SortOrder = 'asc' | 'desc'

export default function DealsPage() {
  const { primaryWallet } = useWallet()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showFilters, setShowFilters] = useState(false)
  
  // Sample deals for demonstration - in a real app, this would come from an API call
  const allDeals: Deal[] = [
    {
      id: 'deal-1',
      title: 'Website Development',
      status: 'active',
      amount: '3.5 ZEC',
      amountUsd: '$280',
      counterparty: 'u1a72...4f23',
      counterpartyName: 'Alex Developer',
      createdAt: '2023-03-15T14:30:00Z',
      progress: 65,
      description: 'Full-stack web application with user authentication, payment integration, and admin dashboard.'
    },
    {
      id: 'deal-2',
      title: 'Logo Design',
      status: 'pending',
      amount: '1.2 ZEC',
      amountUsd: '$96',
      counterparty: 'z8b24...9c12',
      counterpartyName: 'Design Studio',
      createdAt: '2023-03-10T09:15:00Z',
      description: 'Design a modern logo for a tech startup, including brand guidelines and assets.'
    },
    {
      id: 'deal-3',
      title: 'Content Writing',
      status: 'completed',
      amount: '0.8 ZEC',
      amountUsd: '$64',
      counterparty: 't7c31...2d84',
      counterpartyName: 'Content Pro',
      createdAt: '2023-03-01T16:45:00Z',
      description: 'Write 5 blog posts about blockchain technology and crypto privacy.'
    },
    {
      id: 'deal-4',
      title: 'UI/UX Consultation',
      status: 'disputed',
      amount: '2.1 ZEC',
      amountUsd: '$168',
      counterparty: 'q4e56...7f19',
      counterpartyName: 'UX Expert Group',
      createdAt: '2023-02-20T11:30:00Z',
      description: 'Provide UX audit and recommendations for improving user onboarding flow.'
    },
    {
      id: 'deal-5',
      title: 'Mobile App Development',
      status: 'active',
      amount: '5.0 ZEC',
      amountUsd: '$400',
      counterparty: 'r8d92...3h47',
      counterpartyName: 'Mobile Dev Team',
      createdAt: '2023-03-12T10:00:00Z',
      progress: 30,
      description: 'Develop a cross-platform mobile app with React Native for both iOS and Android.'
    },
    {
      id: 'deal-6',
      title: 'Smart Contract Audit',
      status: 'completed',
      amount: '4.2 ZEC',
      amountUsd: '$336',
      counterparty: 'k3j76...9d21',
      counterpartyName: 'Security Auditors',
      createdAt: '2023-02-15T13:20:00Z',
      description: 'Complete security audit of smart contract code for vulnerabilities and optimizations.'
    }
  ]
  
  // Filter deals based on search query and status filter
  const filteredDeals = allDeals.filter(deal => {
    const matchesSearch = searchQuery === '' || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.description && deal.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(deal.status)
    
    return matchesSearch && matchesStatus
  })
  
  // Sort deals based on sort field and order
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortField === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    }
    
    if (sortField === 'amount') {
      const amountA = parseFloat(a.amount.split(' ')[0])
      const amountB = parseFloat(b.amount.split(' ')[0])
      return sortOrder === 'asc' ? amountA - amountB : amountB - amountA
    }
    
    // Default to title sorting
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()
    return sortOrder === 'asc' 
      ? titleA.localeCompare(titleB) 
      : titleB.localeCompare(titleA)
  })
  
  const getStatusColor = (status: Deal['status']) => {
    switch(status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'completed': return 'text-blue-400 bg-blue-400/10'
      case 'disputed': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }
  
  const getStatusIcon = (status: Deal['status']) => {
    switch(status) {
      case 'active': return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-blue-400" />
      case 'disputed': return <AlertCircle className="w-4 h-4 text-red-400" />
      default: return null
    }
  }
  
  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status))
    } else {
      setStatusFilter([...statusFilter, status])
    }
  }
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field and default to descending order
      setSortField(field)
      setSortOrder('desc')
    }
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">All Deals</h1>
        <Link href="/dashboard/deals/create">
          <Button className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/80">
            <Plus className="w-4 h-4" />
            Create Deal
          </Button>
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search deals by title, counterparty, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-2 bg-navy-dark border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {statusFilter.length > 0 && (
              <span className="bg-accent-blue/20 text-accent-blue text-xs font-medium px-2 py-0.5 rounded-full">
                {statusFilter.length}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => toggleSort('createdAt')}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>
              Sort by: {sortField === 'createdAt' ? 'Date' : sortField === 'amount' ? 'Amount' : 'Title'}
              {sortOrder === 'asc' ? ' (Asc)' : ' (Desc)'}
            </span>
          </Button>
        </div>
        
        {showFilters && (
          <div className="pt-4 border-t border-gray-800">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-sm font-medium">Filter by Status</h3>
              {statusFilter.length > 0 && (
                <button
                  onClick={() => setStatusFilter([])}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['active', 'pending', 'completed', 'disputed'].map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusFilter.includes(status)
                      ? getStatusColor(status as Deal['status'])
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Sort by</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { field: 'createdAt', label: 'Date' },
                  { field: 'amount', label: 'Amount' },
                  { field: 'title', label: 'Title' }
                ].map((option) => (
                  <button
                    key={option.field}
                    onClick={() => toggleSort(option.field as SortField)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sortField === option.field
                        ? 'bg-accent-blue/20 text-accent-blue'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {option.label} {sortField === option.field && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Deals List */}
      <div className="space-y-4">
        {sortedDeals.length > 0 ? (
          sortedDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              className="glass-card p-5 hover:border-accent-blue/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="md:flex md:justify-between md:items-start gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(deal.status)}`}>
                      {getStatusIcon(deal.status)}
                      <span className="capitalize">{deal.status}</span>
                    </span>
                    <span className="text-sm text-gray-400">Created {formatDate(deal.createdAt)}</span>
                  </div>
                  
                  <h2 className="text-lg font-semibold mb-1">{deal.title}</h2>
                  
                  {deal.description && (
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {deal.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                    <div>
                      <span className="text-gray-400">Counterparty:</span>
                      <span className="ml-1">{deal.counterpartyName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="ml-1">{deal.amount}</span>
                      <span className="ml-1 text-gray-500">{deal.amountUsd}</span>
                    </div>
                    
                    {deal.status === 'active' && deal.progress !== undefined && (
                      <div>
                        <span className="text-gray-400">Progress:</span>
                        <span className="ml-1">{deal.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 md:mt-0">
                  <Link href={`/dashboard/deals/${deal.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </div>
              
              {deal.status === 'active' && deal.progress !== undefined && (
                <div className="mt-4">
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-blue rounded-full" 
                      style={{ width: `${deal.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No deals found matching your filters</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setStatusFilter([])
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 