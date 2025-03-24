"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon, AlertCircle } from 'lucide-react'

// This is a client component that will be rendered on the client
export default function BlockchainIntegrationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blockchain Integrations</h1>
        <p className="text-lg text-muted-foreground">Explore the on-chain capabilities of ZSecretEscrow</p>
      </div>

      <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Real blockchain integration demo</AlertTitle>
        <AlertDescription className="text-blue-600">
          This page demonstrates the real blockchain integrations. Toggle between demo mode and real transactions to see how ZSecretEscrow connects with Zcash and NEAR.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Blockchain Integrations</CardTitle>
                <CardDescription>
                  ZSecretEscrow connects to Zcash for private transactions and NEAR for intent matching
                </CardDescription>
              </div>
              
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
                On-Chain
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="zcash" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="zcash">Zcash Transactions</TabsTrigger>
                <TabsTrigger value="near">NEAR Intents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="zcash" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Shielded Transactions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ZSecretEscrow uses Zcash&apos;s shielded transactions to ensure privacy in all escrow operations.
                    When funds are deposited into escrow, they are sent using zk-SNARKs to keep the transaction details private.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded border p-3 bg-gray-50">
                      <h4 className="font-medium text-sm mb-1">Shielded Escrow Creation</h4>
                      <p className="text-xs text-muted-foreground">
                        When creating an escrow, funds are sent to a shielded escrow address using memo fields to connect the payment to the specific deal.
                      </p>
                      <div className="mt-2 text-xs bg-black text-green-400 font-mono p-2 rounded overflow-x-auto">
                        <code>
                          {`zcash-cli z_sendmany "fromAddress" "[{\\"address\\": \\"escrowAddress\\", \\"amount\\": 2.5, \\"memo\\": \\"Escrow:deal-123:Website Development\\"}]"`}
                        </code>
                      </div>
                    </div>
                    
                    <div className="rounded border p-3 bg-gray-50">
                      <h4 className="font-medium text-sm mb-1">Shielded Fund Release</h4>
                      <p className="text-xs text-muted-foreground">
                        When funds are released, a shielded transaction transfers the amount to the recipient with appropriate memo data.
                      </p>
                      <div className="mt-2 text-xs bg-black text-green-400 font-mono p-2 rounded overflow-x-auto">
                        <code>
                          {`zcash-cli z_sendmany "escrowAddress" "[{\\"address\\": \\"recipientAddress\\", \\"amount\\": 2.5, \\"memo\\": \\"Release:deal-123:Completed\\"}]"`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Transaction Verification</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All transactions are verified on-chain to ensure that funds have been properly transferred and confirmed.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded border p-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Escrow Creation</span>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            Pending
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Transaction ID</p>
                        <p className="text-xs font-mono break-all">
                          77a6de1a9b621a78245f1164738dc1f57fb5c63907a49d1f3694a4957a5f7691
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">2.5 ZEC</span>
                          <span className="text-xs text-muted-foreground">3 confirmations</span>
                        </div>
                      </div>
                      
                      <div className="rounded border p-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Fund Release</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Confirmed
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Transaction ID</p>
                        <p className="text-xs font-mono break-all">
                          24a9f51b8f623c98762a84d16e72479fb5c28f60a49d1f3694a4957a5f76142
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">1.8 ZEC</span>
                          <span className="text-xs text-muted-foreground">12 confirmations</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-2">
                      <p className="text-xs text-muted-foreground">
                        This is a simplified visualization. In the real application, the <code>TransactionMonitor</code> component displays live transaction status.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="near" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">NEAR Protocol Intents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ZSecretEscrow uses NEAR Protocol&apos;s Intents system to match clients with freelancers based on their requirements and capabilities.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded border p-3 bg-gray-50">
                      <h4 className="font-medium text-sm mb-1">Intent Declaration</h4>
                      <p className="text-xs text-muted-foreground">
                        Users can declare their intents (client seeking services or freelancer offering services) using the NEAR Intents protocol.
                      </p>
                      <div className="mt-2 text-xs bg-black text-blue-400 font-mono p-2 rounded overflow-x-auto">
                        <code>
                          near call app.escrow.near create_intent '{'{'}
                            "type": "escrow_client",
                            "description": "Need a website developer",
                            "amount": 2.5,
                            "parameters": {'{'}
                              "skills": ["react", "nextjs"]
                            {'}'}
                          {'}'}'
                        </code>
                      </div>
                    </div>
                    
                    <div className="rounded border p-3 bg-gray-50">
                      <h4 className="font-medium text-sm mb-1">Intent Matching</h4>
                      <p className="text-xs text-muted-foreground">
                        The system finds and matches compatible intents, enabling the creation of escrow agreements between parties.
                      </p>
                      <div className="mt-2 text-xs bg-black text-blue-400 font-mono p-2 rounded overflow-x-auto">
                        <code>
                          near call app.escrow.near find_matches '{'{'}
                            "intent_id": "intent-123abc",
                            "max_results": 5
                          {'}'}'
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Intent Explorer</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View and manage intents published on the NEAR blockchain.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="rounded border p-3">
                        <div className="flex justify-between mb-2">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            Client Intent
                          </Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Open
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">Need a smart contract developer</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Budget: 3.2 ZEC
                        </p>
                        <p className="text-xs font-mono text-muted-foreground mb-2">
                          Intent ID: intent-0x7a9b4c2d
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Created 2 days ago</span>
                          <span className="text-xs text-muted-foreground">Expires in 3 days</span>
                        </div>
                      </div>
                      
                      <div className="rounded border p-3">
                        <div className="flex justify-between mb-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Freelancer Intent
                          </Badge>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            Matched
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">Experienced React developer available</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Rate: 2.0 ZEC
                        </p>
                        <p className="text-xs font-mono text-muted-foreground mb-2">
                          Intent ID: intent-0x5d4e1f2a
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Created 5 days ago</span>
                          <span className="text-xs text-muted-foreground">Matched with intent-0x7a9b4c2d</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-2">
                      <p className="text-xs text-muted-foreground">
                        This is a simplified visualization. In the real application, the <code>IntentMatcher</code> component provides a full interface for intent management.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t pt-4">
            <div className="w-full">
              <Alert variant="default" className="bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-700">Demo Mode Notice</AlertTitle>
                <AlertDescription className="text-amber-600 text-sm">
                  While the code supports real blockchain integration, this demo is running in simulation mode.
                  The implementation is ready to connect to real Zcash and NEAR networks when deployed in production.
                </AlertDescription>
              </Alert>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 