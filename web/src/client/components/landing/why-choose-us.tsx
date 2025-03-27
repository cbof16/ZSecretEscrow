"use client"

import { Shield, Lock, Zap, Users, Check } from "lucide-react"

const features = [
  {
    title: "Privacy First",
    description: "Your identity and transaction details are protected using zero-knowledge proofs and shielded transactions.",
    icon: Shield
  },
  {
    title: "Secure Escrow",
    description: "Funds are held in smart contracts with multi-signature requirements and time-locked releases.",
    icon: Lock
  },
  {
    title: "Fast Resolution",
    description: "Disputes are resolved quickly through our decentralized arbitration system.",
    icon: Zap
  },
  {
    title: "Community Driven",
    description: "Governed by token holders with transparent voting and proposal mechanisms.",
    icon: Users
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-20 px-4" id="features">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose ZSecretEscrow?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We combine cutting-edge blockchain technology with user-friendly design to create the most secure and private escrow platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border border-gray-200 p-6 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600">
            <Check className="w-4 h-4" />
            <span>Built on Zcash and NEAR Protocol</span>
          </div>
        </div>
      </div>
    </section>
  )
}