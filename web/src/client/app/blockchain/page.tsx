"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Button } from "../../components/ui/button"
import { Navbar } from "../../components/navbar"
import { InfoIcon, ExternalLink, Check, AlertTriangle } from "lucide-react"
import { mockZcashTransactions, mockNearTransactions, mockBlockchainStatus } from "../../lib/mock/blockchain"

export default function BlockchainPage() {
  const [demoMode, setDemoMode] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleToggleDemoMode = () => {
    setDemoMode(!demoMode)
  }

  const handleConnectWallet = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setDemoMode(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Blockchain Integrations</h1>
        
        <Alert className="mb-8 border-blue-600/40 bg-blue-950/20">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Real blockchain integration demo</AlertTitle>
          <AlertDescription className="text-blue-600">
            This page demonstrates the real blockchain integrations. Toggle between demo mode and real transactions to see how ZSecretEscrow connects with Zcash and NEAR.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${demoMode ? 'text-yellow-500' : 'text-green-500'}`}>
              {demoMode ? 'Demo Mode' : 'Live Mode'}
            </span>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-linear rounded-full">
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                checked={!demoMode}
                onChange={handleToggleDemoMode}
                className="absolute w-0 h-0 opacity-0"
              />
              <label
                htmlFor="toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${demoMode ? 'bg-gray-700' : 'bg-blue-600'}`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                    demoMode ? 'translate-x-0' : 'translate-x-6'
                  }`}
                />
              </label>
            </div>
          </div>
          
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting || !demoMode}
            className="bg-accent-blue hover:bg-accent-blue/90"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>

        <Tabs defaultValue="zcash" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="zcash" className="text-base">Zcash</TabsTrigger>
            <TabsTrigger value="near" className="text-base">NEAR</TabsTrigger>
          </TabsList>
          
          <TabsContent value="zcash" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Zcash Network Status</CardTitle>
                <CardDescription>Network and connection details for Zcash integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Connection Status:</span>
                      <span className="flex items-center">
                        {mockBlockchainStatus.zcash.connected ? (
                          <>
                            <Check className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500">Connected</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-yellow-500">Disconnected</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span>{mockBlockchainStatus.zcash.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Block Height:</span>
                      <span>{mockBlockchainStatus.zcash.blockHeight.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sync Status:</span>
                      <span>{mockBlockchainStatus.zcash.syncStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Latest Block:</span>
                      <span className="truncate max-w-[200px]">{mockBlockchainStatus.zcash.latestBlock.hash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Block Timestamp:</span>
                      <span>{new Date(mockBlockchainStatus.zcash.latestBlock.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-400 flex justify-between">
                {demoMode ? (
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                    Running in demo mode with simulated data
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    Connected to Zcash {mockBlockchainStatus.zcash.network}
                  </span>
                )}
                <a 
                  href="https://zcash.readthedocs.io/en/latest/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-accent-blue hover:text-accent-blue/80"
                >
                  Zcash Docs <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Zcash Transactions</CardTitle>
                <CardDescription>Recent shielded and transparent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockZcashTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{tx.amount} ZEC</span>
                        <span className={`text-sm rounded-full px-2 py-0.5 ${
                          tx.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                          tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">From:</span>
                          <div className="truncate">{tx.sender}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">To:</span>
                          <div className="truncate">{tx.recipient}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Date:</span>
                          <div>{new Date(tx.timestamp).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <div className={tx.type === 'shielded' ? 'text-accent-blue' : 'text-gray-300'}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </div>
                        </div>
                      </div>
                      {tx.memo && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <span className="text-gray-400 text-sm">Memo:</span>
                          <div className="text-sm">{tx.memo}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-400">
                {demoMode && (
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                    Demo data shown. Connect your wallet to see real transactions.
                  </span>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="near" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>NEAR Network Status</CardTitle>
                <CardDescription>Network and connection details for NEAR Protocol integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Connection Status:</span>
                      <span className="flex items-center">
                        {mockBlockchainStatus.near.connected ? (
                          <>
                            <Check className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500">Connected</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-yellow-500">Disconnected</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span>{mockBlockchainStatus.near.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Block Height:</span>
                      <span>{mockBlockchainStatus.near.blockHeight.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sync Status:</span>
                      <span>{mockBlockchainStatus.near.syncStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Latest Block:</span>
                      <span className="truncate max-w-[200px]">{mockBlockchainStatus.near.latestBlock.hash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Block Timestamp:</span>
                      <span>{new Date(mockBlockchainStatus.near.latestBlock.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-400 flex justify-between">
                {demoMode ? (
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                    Running in demo mode with simulated data
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    Connected to NEAR {mockBlockchainStatus.near.network}
                  </span>
                )}
                <a 
                  href="https://docs.near.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-accent-blue hover:text-accent-blue/80"
                >
                  NEAR Docs <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent NEAR Transactions</CardTitle>
                <CardDescription>Recent transactions on NEAR Protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNearTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{tx.amount} NEAR</span>
                        <span className={`text-sm rounded-full px-2 py-0.5 ${
                          tx.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                          tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">From:</span>
                          <div className="truncate">{tx.sender}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">To:</span>
                          <div className="truncate">{tx.recipient}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Date:</span>
                          <div>{new Date(tx.timestamp).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Gas:</span>
                          <div>{tx.gas} NEAR</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-400">
                {demoMode && (
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                    Demo data shown. Connect your wallet to see real transactions.
                  </span>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 