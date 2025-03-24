"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { 
  Shield, 
  Lock, 
  BarChart3, 
  Zap, 
  Check, 
  ChevronRight, 
  Sparkles,
  RefreshCcw
} from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background mesh-gradient overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
                  Private • Secure • Trustless
                </span>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-blue to-accent-purple">
                  Secure Crypto Escrow with Privacy Built In
                </h1>
                <p className="mt-4 text-gray-300 text-lg">
                  ZSecretEscrow provides encrypted blockchain escrow services that protect your identity while ensuring secure transactions between untrusted parties.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/connect-wallet">
                  <Button size="lg" className="w-full sm:w-auto bg-accent-blue hover:bg-accent-blue/80">
                    Connect Wallet
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent-blue" />
                  <span className="text-sm text-gray-300">End-to-end Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent-blue" />
                  <span className="text-sm text-gray-300">Shielded Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5 text-accent-blue" />
                  <span className="text-sm text-gray-300">Multi-chain Support</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Sample escrow card display */}
                <div className="glass-card p-6 border-accent-blue/30 shadow-glow-blue rotate-2 absolute -right-4 top-10 z-20 max-w-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Website Development</h3>
                      <div className="flex items-center mt-1">
                        <span className="bg-green-400/10 text-green-400 text-xs px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">3.5 ZEC</div>
                      <div className="text-xs text-gray-400">$280</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Progress</div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-blue rounded-full w-[65%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 border-purple-500/30 shadow-glow-purple -rotate-3 relative z-10 max-w-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Smart Contract Audit</h3>
                      <div className="flex items-center mt-1">
                        <span className="bg-blue-400/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">4.2 ZEC</div>
                      <div className="text-xs text-gray-400">$336</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-400">Client:</span>
                      <span className="ml-1">zs1qu9...38fh</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Provider:</span>
                      <span className="ml-1">zs1v7e...45jk</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-blue/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] -z-10"></div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
                Platform Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose ZSecretEscrow?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our platform combines the security of blockchain technology with the privacy features of zero-knowledge proofs to provide a trustless escrow service.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-accent-blue" />,
                title: "Secure Escrow",
                description: "Funds are locked in a secure smart contract until both parties confirm the transaction is complete."
              },
              {
                icon: <Lock className="w-8 h-8 text-accent-blue" />,
                title: "Privacy Protection",
                description: "Your identity is shielded using zero-knowledge proofs, keeping your personal information private."
              },
              {
                icon: <RefreshCcw className="w-8 h-8 text-accent-blue" />,
                title: "Multi-chain Support",
                description: "Connect with Zcash, Ethereum, NEAR, Base, Polygon and more chains coming soon."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-accent-blue" />,
                title: "Transaction Dashboard",
                description: "Monitor all your active, pending, and completed escrow deals in one intuitive dashboard."
              },
              {
                icon: <Zap className="w-8 h-8 text-accent-blue" />,
                title: "Fast Settlement",
                description: "Quick and efficient transaction settlement with automated verification processes."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-accent-blue" />,
                title: "Dispute Resolution",
                description: "Impartial dispute resolution system to ensure fair outcomes in contested transactions."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-slate-900/50" id="how-it-works">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How ZSecretEscrow Works
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our platform makes it easy to set up secure escrow deals in just a few steps, with privacy and security built in.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Connect your cryptocurrency wallet to the platform securely."
              },
              {
                step: "02",
                title: "Create a Deal",
                description: "Specify the terms, amount, and counterparty for your escrow transaction."
              },
              {
                step: "03",
                title: "Secure Funds",
                description: "Deposit funds into the escrow smart contract for safekeeping."
              },
              {
                step: "04",
                title: "Release Payment",
                description: "Once satisfied, release the funds to complete the transaction."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-6">
                  <div className="text-4xl font-bold text-accent-blue/20 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
                
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-accent-blue/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 px-4" id="benefits">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Benefits of Using ZSecretEscrow
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our platform provides unique advantages for both clients and freelancers with cutting-edge blockchain technology.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold mb-4">For Clients</h3>
              <ul className="space-y-3">
                {[
                  "Protect your funds until work is successfully completed",
                  "Maintain privacy with shielded transactions",
                  "Define clear milestones and delivery requirements",
                  "Eliminate payment fraud and disputes",
                  "Access a global talent pool without currency concerns",
                  "No intermediary fees - pay only for the work"
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="min-w-5 h-5 text-accent-blue mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-3">
                {[
                  "Guaranteed payment for completed work",
                  "Protect your identity and personal data",
                  "Receive payments from anywhere in the world",
                  "Build reputation without revealing personal information",
                  "No platform fees taking a percentage of your earnings",
                  "Control when and how work is delivered and approved"
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="min-w-5 h-5 text-accent-blue mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Waitlist Section */}
      <section className="py-20 px-4 bg-slate-900/30" id="waitlist">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-card p-8 border-accent-blue/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
                Coming Soon
              </span>
              <h2 className="text-3xl font-bold mb-4">
                Join the ZSecretEscrow Waitlist
              </h2>
              <p className="text-gray-300 mb-8">
                The production application is launching soon! Sign up to be first in line for access and receive updates on our progress.
              </p>
              
              <form className="space-y-4 max-w-md mx-auto">
                <div>
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="input-primary"
                    required 
                  />
                </div>
                <div>
                  <Button className="w-full bg-accent-blue hover:bg-accent-blue/80">
                    Join Waitlist
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="glass-card p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Connect your wallet now and experience the most secure way to transact in the crypto space with complete privacy protection.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/connect-wallet">
                <Button size="lg" className="w-full sm:w-auto bg-accent-blue hover:bg-accent-blue/80">
                  Connect Wallet
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900/80 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">ZSecretEscrow</h3>
              <p className="text-gray-400 mb-4">
                Secure escrow services with privacy protection for cryptocurrency transactions.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors" aria-label="Discord">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/#benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</a></li>
                <li><a href="/#waitlist" className="text-gray-400 hover:text-white transition-colors">Join Waitlist</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/blockchain" className="text-gray-400 hover:text-white transition-colors">Blockchain</a></li>
                <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/connect-wallet" className="text-gray-400 hover:text-white transition-colors">Connect Wallet</a></li>
                <li><a href="/dashboard/deals/create" className="text-gray-400 hover:text-white transition-colors">Create Deal</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="mailto:contact@zsecretescrow.com" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} ZSecretEscrow. All rights reserved.</p>
            <p className="mt-2">
              <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">
                Demo Version
              </span>
              <span className="ml-2 text-xs">Full release coming soon - <a href="/#waitlist" className="text-accent-blue hover:underline">Join the waitlist</a></span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}