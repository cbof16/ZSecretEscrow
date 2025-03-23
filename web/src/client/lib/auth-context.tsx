"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Define the user type
export type User = {
  id: string
  email: string
  name?: string
  walletAddress?: string
  avatar?: string
}

// Define the auth context shape
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // For now, we'll check local storage, but in a real app this would check with your backend
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to restore auth session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkUserSession()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would typically be an API call to your backend
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      }
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      router.push('/dashboard')
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // This would typically be an API call to your backend
      // For demo purposes, we'll simulate a successful registration
      const mockUser: User = {
        id: '1',
        email,
        name,
      }
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      router.push('/dashboard')
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/sign-in')
  }

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      // This would typically be an API call to your backend
      // For demo purposes, we'll just console log
      console.log(`Password reset email sent to ${email}`)
    } catch (error) {
      console.error("Forgot password request failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true)
    try {
      // This would typically be an API call to your backend
      // For demo purposes, we'll just console log
      console.log(`Password has been reset with token: ${token}`)
    } catch (error) {
      console.error("Password reset failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
} 