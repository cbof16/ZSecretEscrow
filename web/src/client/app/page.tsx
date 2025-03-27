"use client"

import { Hero } from "../components/landing/hero"
import { Stats } from "../components/landing/stats"
import { WhyChooseUs } from "../components/landing/why-choose-us"
import { Navbar } from "../components/navbar"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background mesh-gradient overflow-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <WhyChooseUs />
    </main>
  )
} 