"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { useWallet } from "@/lib/wallet-context"
import { AlertCircle } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background mesh-gradient">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}

function ClientDashboard({ children }: { children: React.ReactNode }) {
  // Check if in demo mode
  const { isDemo } = useWallet()
  
  return (
    <>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {isDemo && (
            <div className="bg-yellow-500/20 text-yellow-300 py-2 px-4 text-sm flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Demo Mode: You're using a simulated wallet for testing purposes. Transactions are not real.
            </div>
          )}
          <div className="container mx-auto p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </>
  )
} 