"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "../../components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Calendar, CheckCircle2, Clock, AlertTriangle, ExternalLink, PlusCircle, Wallet } from "lucide-react"
import { mockEscrowContracts } from "../../lib/mock/blockchain"
import { useWalletStore } from "../../store/wallet-store"

// Define milestone interface
interface Milestone {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

// Define escrow data interface
interface NewEscrowData {
  title: string;
  description: string;
  freelancerAddress: string;
  totalAmount: string;
  currency: "ZEC" | "NEAR";
  milestones: Milestone[];
}

// Add more interfaces at the top of the file after the existing interfaces
interface MilestoneType {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'disputed';
  dueDate: string;
}

interface EscrowContract {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'disputed' | 'cancelled';
  value: number;
  currency: 'ZEC' | 'NEAR';
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  created: string;
  updated: string;
  milestones: MilestoneType[];
}

export default function ClientDashboard() {
  const router = useRouter()
  const { isConnected } = useWalletStore()
  const [activeTab, setActiveTab] = useState("active")
  const [newEscrowData, setNewEscrowData] = useState<NewEscrowData>({
    title: "",
    description: "",
    freelancerAddress: "",
    totalAmount: "",
    currency: "ZEC",
    milestones: [
      { title: "", description: "", amount: "", dueDate: "" }
    ]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [demoEscrows, setDemoEscrows] = useState<EscrowContract[]>([...mockEscrowContracts])

  // Filter contracts for client view
  const filteredEscrows = {
    active: demoEscrows.filter(escrow => escrow.status === 'active'),
    completed: demoEscrows.filter(escrow => escrow.status === 'completed'),
    all: demoEscrows
  }

  // Redirect to connect wallet if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/connect-wallet")
    }
  }, [isConnected, router])

  // Handle creating a new milestone
  const addMilestone = (): void => {
    setNewEscrowData({
      ...newEscrowData,
      milestones: [
        ...newEscrowData.milestones,
        { title: "", description: "", amount: "", dueDate: "" }
      ]
    })
  }

  // Handle removing a milestone
  const removeMilestone = (index: number): void => {
    if (newEscrowData.milestones.length > 1) {
      const updatedMilestones = [...newEscrowData.milestones]
      updatedMilestones.splice(index, 1)
      setNewEscrowData({
        ...newEscrowData,
        milestones: updatedMilestones
      })
    }
  }

  // Handle milestone field changes
  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string): void => {
    const updatedMilestones = [...newEscrowData.milestones]
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value
    }
    setNewEscrowData({
      ...newEscrowData,
      milestones: updatedMilestones
    })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setNewEscrowData({
      ...newEscrowData,
      [name]: value
    })
  }

  // Create new escrow contract (demo)
  const handleCreateEscrow = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Demo implementation - create a new escrow after slight delay
    setTimeout(() => {
      const totalAmount = parseFloat(newEscrowData.totalAmount)
      
      // Create milestone objects with proper typing
      const milestonesArray: MilestoneType[] = newEscrowData.milestones.map((m, index) => ({
        id: `new-milestone-${Date.now()}-${index}`,
        title: m.title,
        description: m.description,
        amount: parseFloat(m.amount),
        status: (index === 0 ? 'active' : 'pending') as 'pending' | 'active' | 'completed' | 'disputed',
        dueDate: m.dueDate
      }));
      
      // Create new escrow contract
      const newEscrow: EscrowContract = {
        id: `escrow-${Date.now()}`,
        title: newEscrowData.title,
        description: newEscrowData.description,
        status: "active" as "active" | "completed" | "disputed" | "cancelled",
        value: totalAmount,
        currency: newEscrowData.currency,
        clientId: 'you.near',
        clientName: 'You',
        freelancerId: newEscrowData.freelancerAddress,
        freelancerName: 'Hired Freelancer',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        milestones: milestonesArray
      }
      
      // Add to demo escrows
      setDemoEscrows([newEscrow, ...demoEscrows])
      
      // Reset form
      setNewEscrowData({
        title: "",
        description: "",
        freelancerAddress: "",
        totalAmount: "",
        currency: "ZEC",
        milestones: [
          { title: "", description: "", amount: "", dueDate: "" }
        ]
      })
      
      setIsSubmitting(false)
      // Switch to active tab to show the new escrow
      setActiveTab("active")
    }, 1500)
  }

  // Get progress percentage for an escrow
  const getEscrowProgress = (escrow: EscrowContract): number => {
    const totalMilestones = escrow.milestones.length
    const completedMilestones = escrow.milestones.filter(m => m.status === 'completed').length
    return Math.round((completedMilestones / totalMilestones) * 100)
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }
  
  // Handle release payment for a milestone (demo)
  const handleReleasePayment = (escrowId: string, milestoneId: string): void => {
    // Update the milestone status
    const updatedEscrows = demoEscrows.map(escrow => {
      if (escrow.id === escrowId) {
        const updatedMilestones = escrow.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return { ...milestone, status: 'completed' as const }
          }
          
          // Activate the next pending milestone
          if (milestone.status === 'pending' && 
              escrow.milestones.some(m => m.id === milestoneId && m.status !== 'pending')) {
            return { ...milestone, status: 'active' as const }
          }
          
          return milestone
        })
        
        // Check if all milestones are completed
        const allCompleted = updatedMilestones.every(m => m.status === 'completed')
        
        return { 
          ...escrow, 
          milestones: updatedMilestones,
          status: allCompleted ? 'completed' as const : 'active' as const,
          updated: new Date().toISOString()
        }
      }
      return escrow
    })
    
    setDemoEscrows(updatedEscrows)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Manage your escrow contracts and payments with freelancers
        </p>
        
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="active">Active Escrows</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="create">Create New Escrow</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Active Escrows Tab */}
          <TabsContent value="active" className="space-y-6">
            {filteredEscrows.active.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Escrows</CardTitle>
                  <CardDescription>You don&apos;t have any active escrow contracts yet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab("create")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Escrow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredEscrows.active.map(escrow => (
                <Card key={escrow.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{escrow.title}</CardTitle>
                        <CardDescription className="mt-1">{escrow.description}</CardDescription>
                      </div>
                      <Badge 
                        className={
                          escrow.status === 'active' ? 'bg-green-500' : 
                          escrow.status === 'disputed' ? 'bg-yellow-500' : 
                          'bg-gray-500'
                        }
                      >
                        {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Freelancer</p>
                        <p className="font-medium">{escrow.freelancerName}</p>
                        <p className="text-xs text-gray-400 truncate">{escrow.freelancerId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                        <p className="font-medium flex items-center">
                          {escrow.value} {escrow.currency}
                          <Wallet className="w-3 h-3 ml-1 text-blue-500" />
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Created</p>
                        <p className="font-medium">{formatDate(escrow.created)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{getEscrowProgress(escrow)}%</span>
                      </div>
                      <Progress value={getEscrowProgress(escrow)} className="h-2" />
                    </div>
                    
                    <div className="mt-6 mb-4">
                      <h4 className="text-sm font-medium mb-2">Milestones</h4>
                      <div className="space-y-3">
                        {escrow.milestones.map((milestone) => (
                          <div 
                            key={milestone.id} 
                            className={`p-3 rounded-lg border ${
                              milestone.status === 'completed' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 
                              milestone.status === 'active' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 
                              'bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  {milestone.status === 'completed' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  ) : milestone.status === 'active' ? (
                                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                                  ) : (
                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                  )}
                                  <h5 className="font-medium text-sm">
                                    {milestone.title}
                                  </h5>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                                  {milestone.description}
                                </p>
                              </div>
                              <div className="flex flex-col items-end ml-4">
                                <span className="text-sm font-medium">
                                  {milestone.amount} {escrow.currency}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Due: {formatDate(milestone.dueDate)}
                                </span>
                              </div>
                            </div>
                            
                            {milestone.status === 'active' && (
                              <div className="mt-2 ml-6">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleReleasePayment(escrow.id, milestone.id)}
                                >
                                  Release Payment
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between text-sm text-gray-500 pt-2 pb-4">
                    <div>Last updated: {formatDate(escrow.updated)}</div>
                    <div>
                      <a 
                        href="#" 
                        className="text-blue-500 hover:text-blue-600 flex items-center"
                        onClick={(e) => e.preventDefault()}
                      >
                        View on blockchain <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
          
          {/* Completed Escrows Tab */}
          <TabsContent value="completed" className="space-y-6">
            {filteredEscrows.completed.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Completed Escrows</CardTitle>
                  <CardDescription>You haven&apos;t completed any escrow contracts yet.</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              filteredEscrows.completed.map(escrow => (
                <Card key={escrow.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{escrow.title}</CardTitle>
                        <CardDescription className="mt-1">{escrow.description}</CardDescription>
                      </div>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Freelancer</p>
                        <p className="font-medium">{escrow.freelancerName}</p>
                        <p className="text-xs text-gray-400 truncate">{escrow.freelancerId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                        <p className="font-medium flex items-center">
                          {escrow.value} {escrow.currency}
                          <Wallet className="w-3 h-3 ml-1 text-blue-500" />
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Completed On</p>
                        <p className="font-medium">{formatDate(escrow.updated)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between text-sm text-gray-500 pt-2 pb-4">
                    <div>Completed on: {formatDate(escrow.updated)}</div>
                    <div>
                      <a 
                        href="#" 
                        className="text-blue-500 hover:text-blue-600 flex items-center"
                        onClick={(e) => e.preventDefault()}
                      >
                        View on blockchain <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
          
          {/* Create New Escrow Tab */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Escrow Contract</CardTitle>
                <CardDescription>
                  Set up a new escrow agreement with a freelancer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEscrow}>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="title">Project Title</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="Website Development"
                            value={newEscrowData.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Project Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe the project scope and deliverables"
                            value={newEscrowData.description}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="freelancerAddress">Freelancer Address</Label>
                          <Input
                            id="freelancerAddress"
                            name="freelancerAddress"
                            placeholder="Zcash or NEAR address"
                            value={newEscrowData.freelancerAddress}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="totalAmount">Total Amount</Label>
                            <Input
                              id="totalAmount"
                              name="totalAmount"
                              type="number"
                              step="0.001"
                              min="0"
                              placeholder="0.00"
                              value={newEscrowData.totalAmount}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="currency">Currency</Label>
                            <select
                              id="currency"
                              name="currency"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={newEscrowData.currency}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="ZEC">ZEC</option>
                              <option value="NEAR">NEAR</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Milestones</h3>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline"
                          onClick={addMilestone}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Milestone
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {newEscrowData.milestones.map((milestone, index) => (
                          <div 
                            key={index} 
                            className="p-4 border rounded-md relative"
                          >
                            <div className="absolute -top-3 left-3 bg-background px-2 text-sm text-gray-500">
                              Milestone {index + 1}
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label htmlFor={`milestone-${index}-title`}>Title</Label>
                                <Input
                                  id={`milestone-${index}-title`}
                                  placeholder="Milestone title"
                                  value={milestone.title}
                                  onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`milestone-${index}-description`}>Description</Label>
                                <Textarea
                                  id={`milestone-${index}-description`}
                                  placeholder="Describe what will be delivered in this milestone"
                                  value={milestone.description}
                                  onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                  required
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`milestone-${index}-amount`}>Amount</Label>
                                  <Input
                                    id={`milestone-${index}-amount`}
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    placeholder="0.00"
                                    value={milestone.amount}
                                    onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`milestone-${index}-dueDate`}>Due Date</Label>
                                  <Input
                                    id={`milestone-${index}-dueDate`}
                                    type="date"
                                    value={milestone.dueDate}
                                    onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                              
                              {newEscrowData.milestones.length > 1 && (
                                <div className="flex justify-end">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeMilestone(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    Remove Milestone
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-4">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <p className="text-xs text-gray-500">
                        This will create a real escrow contract on the blockchain. Funds will be locked until milestones are approved.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Creating Escrow...</>
                      ) : (
                        <>Create Escrow Contract</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}