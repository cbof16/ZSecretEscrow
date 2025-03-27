"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Shield, Lock } from "lucide-react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Set a slight delay to trigger animations
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className={`hidden sm:mb-8 sm:flex sm:justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white ring-1 ring-white/30 hover:ring-white/50">
            <Lock className="inline-block w-4 h-4 mr-1" />
            Powered by zero-knowledge proofs and privacy tech
          </div>
        </div>
        <div className="text-center">
          <h1 className={`text-4xl font-bold tracking-tight text-white sm:text-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block">Z<Shield className="inline-block h-10 w-10 text-white animate-pulse" />Secret</span>
            <span className="text-white">Escrow</span>
          </h1>
          <p className={`mt-6 text-lg leading-8 text-white/80 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            The privacy-first blockchain escrow platform for secure transactions
            between untrusted parties with advanced privacy features.
          </p>
          <div className={`mt-10 flex items-center justify-center gap-x-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link href="/blockchain">
              <Button size="lg" className="hover:scale-105 transition-transform">
                Get Started
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-white group">
              Learn more <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 