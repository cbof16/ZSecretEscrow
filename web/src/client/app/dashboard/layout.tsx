"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"

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