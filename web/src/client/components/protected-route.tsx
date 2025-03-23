"use client"

import { useWallet } from "@/lib/wallet-context"
import { useRouter, usePathname } from "next/navigation"
import React, { useEffect } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isConnecting } = useWallet()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip redirect during loading to avoid flashing
    if (!isConnecting && !isAuthenticated) {
      // Store the path they were trying to access
      sessionStorage.setItem("redirectAfterConnect", pathname)
      router.push("/connect-wallet")
    }
  }, [isAuthenticated, isConnecting, router, pathname])

  // Show a loading state
  if (isConnecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-accent-blue border-t-transparent"></div>
      </div>
    )
  }

  // Render children only if authenticated
  return isAuthenticated ? <>{children}</> : null
} 