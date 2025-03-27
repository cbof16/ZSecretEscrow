"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Navbar } from "../../components/navbar"
import { 
  LineChart, 
  BarChart, 
  Wallet, 
  Clock, 
  Settings, 
  Shield, 
  Bell, 
  Activity 
} from "lucide-react"
import { mockEscrowContracts } from "../../lib/mock/blockchain"
import { ActivityCard } from "../../components/freelancer/activity-card"
import { PrivacySettings } from "../../components/freelancer/privacy-settings"

// Mock data for the dashboard
const mockData = {
  earnings: [
    { month: 'Jan', amount: 2500 },
    { month: 'Feb', amount: 3200 },
    { month: 'Mar', amount: 4100 },
    { month: 'Apr', amount: 3800 },
    { month: 'May', amount: 4300 },
    { month: 'Jun', amount: 5200 }
  ],
  pendingEarnings: 3450,
  completedProjects: 21,
  activeEscrows: mockEscrowContracts.filter(
    (contract) => contract.freelancerId === 'demo.near' && contract.status === 'active'
  ),
  recentTransactions: [
    { id: 'tx1', amount: 750, currency: 'NEAR', from: 'alice.near', date: '2023-03-15', status: 'complete' },
    { id: 'tx2', amount: 1.25, currency: 'ZEC', from: 'z_sender123...', date: '2023-03-12', status: 'pending' },
    { id: 'tx3', amount: 500, currency: 'NEAR', from: 'bob.near', date: '2023-03-10', status: 'complete' }
  ]
};

export default function FreelancerDashboard() {
  const [demoMode, setDemoMode] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-24 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your escrow contracts and earnings</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Demo Mode</div>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                demoMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-5 h-12">
            <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
            <TabsTrigger value="escrows" className="text-base">Active Escrows</TabsTrigger>
            <TabsTrigger value="earnings" className="text-base">Earnings</TabsTrigger>
            <TabsTrigger value="activity" className="text-base">Activity</TabsTrigger>
            <TabsTrigger value="settings" className="text-base">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,450</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Escrows</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">2 pending completion</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-xs text-muted-foreground">21 completed, 0 cancelled</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Escrows */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Escrow Activity</CardTitle>
                <CardDescription>Your most recent escrow contracts and status updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockEscrowContracts.slice(0, 3).map((contract) => (
                    <div key={contract.id} className="flex gap-4 p-4 border border-border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        contract.status === 'active' ? 'bg-blue-500/10' :
                        contract.status === 'completed' ? 'bg-green-500/10' :
                        'bg-yellow-500/10'
                      }`}>
                        <Shield className={`h-5 w-5 ${
                          contract.status === 'active' ? 'text-blue-500' :
                          contract.status === 'completed' ? 'text-green-500' :
                          'text-yellow-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{contract.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            contract.status === 'active' ? 'bg-blue-500/10 text-blue-500' :
                            contract.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Client: {contract.clientName}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>{contract.value} {contract.currency}</span>
                          <span>Created: {new Date(contract.created).toLocaleDateString()}</span>
                        </div>
                        {contract.status === 'active' && (
                          <div className="mt-3 space-y-2">
                            <div className="text-xs text-muted-foreground">Milestone Progress</div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-3/5"></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                {contract.milestones.filter(m => m.status === 'completed').length} of {contract.milestones.length} milestones completed
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Escrows
                </Button>
              </CardFooter>
            </Card>
            
            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your earnings over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end gap-2">
                  {mockData.earnings.map((month) => (
                    <div key={month.month} className="relative flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-t" 
                        style={{ height: `${(month.amount / 5500) * 100}%` }}
                      ></div>
                      <span className="text-xs text-muted-foreground mt-2">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="escrows" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Active Escrow Contracts</CardTitle>
                <CardDescription>Monitor and manage your ongoing contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockEscrowContracts
                    .filter(contract => contract.status === 'active')
                    .map((contract) => (
                    <div key={contract.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between mb-3">
                        <h3 className="font-medium text-lg">{contract.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{contract.description}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Client</div>
                          <div className="font-medium">{contract.clientName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Value</div>
                          <div className="font-medium">{contract.value} {contract.currency}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Created</div>
                          <div className="font-medium">{new Date(contract.created).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Milestones</div>
                          <div className="font-medium">
                            {contract.milestones.filter(m => m.status === 'completed').length} of {contract.milestones.length} completed
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Milestone Progress</span>
                          <span>
                            {Math.round((contract.milestones.filter(m => m.status === 'completed').length / contract.milestones.length) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600" 
                            style={{ width: `${(contract.milestones.filter(m => m.status === 'completed').length / contract.milestones.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button size="sm">Manage Contract</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Earnings</CardTitle>
                  <CardDescription>Funds available for withdrawal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$5,120</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="inline-flex items-center text-green-500">
                      <span className="mr-1">↑</span> $1,500 from last month
                    </span>
                  </p>
                  <div className="mt-4">
                    <Button className="w-full">Withdraw Funds</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pending Earnings</CardTitle>
                  <CardDescription>Funds in escrow contracts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$3,450</div>
                  <p className="text-sm text-muted-foreground mt-2">Across 3 active escrow contracts</p>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View Contracts</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          tx.status === 'complete' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                        }`}>
                          <Wallet className={`h-5 w-5 ${
                            tx.status === 'complete' ? 'text-green-500' : 'text-yellow-500'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium">Payment from {tx.from}</div>
                          <div className="text-sm text-muted-foreground">{tx.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {tx.amount} {tx.currency}
                        </div>
                        <div className={`text-xs ${
                          tx.status === 'complete' ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {tx.status === 'complete' ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-8">
            <ActivityCard />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 