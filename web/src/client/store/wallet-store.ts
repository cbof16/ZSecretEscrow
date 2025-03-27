"use client"

import { create } from 'zustand'

interface WalletState {
  // Wallet connection status
  isConnected: boolean
  address: string | null
  balance: number | null
  network: string | null
  demoMode: boolean
  
  // Actions
  connect: () => void
  disconnect: () => void
  setDemoMode: (isDemoMode: boolean) => void
  toggleDemoMode: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  // Initial state
  isConnected: false,
  address: null,
  balance: null,
  network: null,
  demoMode: true,
  
  // Actions
  connect: () => set({ 
    isConnected: true,
    address: 'demo.near',
    balance: 245.5,
    network: 'testnet',
    demoMode: false
  }),
  
  disconnect: () => set({ 
    isConnected: false,
    address: null,
    balance: null,
    network: null,
    demoMode: true
  }),
  
  setDemoMode: (isDemoMode) => set({ demoMode: isDemoMode }),
  
  toggleDemoMode: () => set((state) => {
    if (state.demoMode) {
      // If we're in demo mode and want to exit, we need to connect
      return {
        isConnected: true,
        address: 'demo.near',
        balance: 245.5,
        network: 'testnet',
        demoMode: false
      }
    } else {
      // If we're not in demo mode and want to enter, we need to disconnect
      return {
        isConnected: false,
        address: null,
        balance: null,
        network: null,
        demoMode: true
      }
    }
  }),
})) 