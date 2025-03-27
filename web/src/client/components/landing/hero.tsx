"use client"

import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Shield, Lock } from "lucide-react"

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            <Lock className="inline-block w-4 h-4 mr-1" />
            Powered by zero-knowledge proofs and privacy tech
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="inline-block">Z<Shield className="inline-block h-10 w-10 text-primary" />Secret</span>
            <span className="text-primary">Escrow</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The privacy-first blockchain escrow platform for secure transactions
            between untrusted parties with advanced privacy features.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/blockchain">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 