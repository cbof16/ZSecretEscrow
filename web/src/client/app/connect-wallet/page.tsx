"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "../../components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Shield, ExternalLink, AlertTriangle } from "lucide-react"
import { useWalletStore } from "../../store/wallet-store"

export default function ConnectWalletPage() {
  const router = useRouter()
  const { connect } = useWalletStore()

  const wallets = [
    {
      id: "demo",
      name: "Demo Zcash Wallet",
      description: "Use our demo wallet for testing the platform features",
      icon: Shield,
      status: "active",
      action: () => {
        connect()
        // Redirect back to previous page or home
        router.back()
      }
    },
    {
      id: "zingo",
      name: "Zingo Wallet",
      description: "Full-featured Zcash wallet for mobile and desktop",
      icon: Shield,
      status: "coming-soon",
      externalLink: "https://zingolabs.github.io/"
    },
    {
      id: "zashi",
      name: "Zashi Wallet",
      description: "Modern shielded Zcash wallet by Electric Coin Co",
      icon: Shield,
      status: "coming-soon",
      externalLink: "https://zashi.io/"
    },
    {
      id: "ywallet",
      name: "YWallet",
      description: "Privacy-focused mobile wallet for Zcash",
      icon: Shield,
      status: "coming-soon",
      externalLink: "https://ywallet.app/"
    },
    {
      id: "nighthawk",
      name: "Nighthawk Wallet",
      description: "Privacy-first mobile wallet for Zcash",
      icon: Shield,
      status: "coming-soon",
      externalLink: "https://nighthawkwallet.com/"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold mb-4">Connect Your Zcash Wallet</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Choose a wallet to connect to ZSecretEscrow and start using privacy-first escrow services
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <Card 
              key={wallet.id} 
              className={`border ${
                wallet.status === "active" 
                  ? "border-blue-500 shadow-md" 
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <wallet.icon className={`h-5 w-5 ${
                      wallet.status === "active" ? "text-blue-500" : "text-gray-400"
                    }`} />
                    <CardTitle className="text-lg">{wallet.name}</CardTitle>
                  </div>
                  {wallet.status === "coming-soon" && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Coming Soon
                    </span>
                  )}
                </div>
                <CardDescription>{wallet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {wallet.status === "active" ? (
                  <Button 
                    className="w-full" 
                    onClick={wallet.action}
                  >
                    Connect Wallet
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    Not Available Yet
                  </Button>
                )}
              </CardContent>
              {wallet.externalLink && (
                <CardFooter>
                  <a 
                    href={wallet.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    Learn more <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
        
        <div className="mt-8 p-4 border border-yellow-200 rounded-md bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/50">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Demo Mode Notice</h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-500">
                Currently, only the Demo Zcash Wallet is available for testing. Integration with other wallets is coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 