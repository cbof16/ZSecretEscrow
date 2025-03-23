"use client"

import React from 'react'
import { motion } from "framer-motion"
import { Shield, Wallet, Menu, X, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from '@/lib/wallet-context'

export function Navbar() {
  const { isAuthenticated, primaryWallet, disconnectAll, isDemo } = useWallet()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Simple check if user is in dashboard pages
  const isInDashboard = pathname?.startsWith('/dashboard')
  
  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed w-full z-50 top-0 left-0 right-0 glass-card border-b border-white/10 ${pathname === '/' ? 'bg-transparent' : 'bg-navy-dark/80 backdrop-blur-md'}`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-accent-blue" />
          <span className="text-xl font-bold relative">
            ZSecretEscrow
            {isDemo && (
              <span className="absolute -top-2 -right-12 text-[9px] font-medium bg-yellow-500/30 text-yellow-300 px-1.5 py-0.5 rounded-sm">
                DEMO MODE
              </span>
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {!isInDashboard ? (
            // Landing page navigation
            <>
              <Link href="/#features" className="text-sm text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">
                How it Works
              </Link>
              <Link href="/#benefits" className="text-sm text-gray-300 hover:text-white transition-colors">
                Benefits
              </Link>
            </>
          ) : (
            // Dashboard navigation
            <>
              <Link href="/dashboard" className={`text-sm hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-white' : 'text-gray-300'}`}>
                Dashboard
              </Link>
              <Link href="/dashboard/deals" className={`text-sm hover:text-white transition-colors ${pathname === '/dashboard/deals' ? 'text-white' : 'text-gray-300'}`}>
                All Deals
              </Link>
              <Link href="/dashboard/deals/create" className={`text-sm hover:text-white transition-colors ${pathname === '/dashboard/deals/create' ? 'text-white' : 'text-gray-300'}`}>
                Create Deal
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isInDashboard ? (
            <Link href="/connect-wallet">
              <Button className="bg-accent-blue hover:bg-accent-blue/90">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm">Connected</span>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-1" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-navy-dark/95 backdrop-blur-md border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {!isInDashboard ? (
              // Landing page navigation
              <>
                <Link href="/#features" className="text-sm py-2 text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                  Features
                </Link>
                <Link href="/#how-it-works" className="text-sm py-2 text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                  How it Works
                </Link>
                <Link href="/#benefits" className="text-sm py-2 text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                  Benefits
                </Link>
              </>
            ) : (
              // Dashboard navigation
              <>
                <Link href="/dashboard" className="text-sm py-2 text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Link href="/dashboard/deals" className="text-sm py-2 text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                  All Deals
                </Link>
                <Link href="/dashboard/deals/create" className="text-sm py-2 text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                  Create Deal
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}