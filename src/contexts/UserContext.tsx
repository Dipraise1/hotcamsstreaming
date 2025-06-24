'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { useWallet } from '@solana/wallet-adapter-react'

interface UserProfile {
  id: string
  username: string
  displayName?: string
  email?: string
  avatar?: string
  bio?: string
  location?: string
  dateOfBirth?: string
  isVerified: boolean
  role: 'VIEWER' | 'PERFORMER' | 'MODERATOR' | 'ADMIN'
  ethAddress?: string
  solAddress?: string
  isProfileComplete: boolean
  canStream: boolean
  streamingApproved: boolean
  performerProfile?: {
    stageName: string
    age: number
    gender: 'FEMALE' | 'MALE' | 'COUPLE' | 'TRANS' | 'NON_BINARY'
    category: string
    tags: string[]
    photos: string[]
    videos: string[]
    privateShowRate: number
    totalViews: number
    rating: number
    ratingCount: number
    totalEarnings: number
  }
  followerCount: number
  followingCount: number
}

interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  isConnected: boolean
  walletAddress: string | null
  walletType: 'ethereum' | 'solana' | null
  hasProfile: boolean
  isProfileSetupComplete: boolean
  createProfile: (profileData: Partial<UserProfile>) => Promise<void>
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>
  refreshUser: () => Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | null>(null)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

  // Ethereum wallet
  const { address: ethAddress, isConnected: isEthConnected } = useAccount()
  
  // Solana wallet
  const { publicKey: solPublicKey, connected: isSolConnected } = useWallet()

  const isConnected = isEthConnected || isSolConnected
  const walletAddress = ethAddress || solPublicKey?.toString() || null
  const walletType = isEthConnected ? 'ethereum' : isSolConnected ? 'solana' : null

  const isProfileSetupComplete = user?.isProfileComplete || false

  useEffect(() => {
    if (isConnected && walletAddress) {
      checkUserProfile()
    } else {
      setUser(null)
      setHasProfile(false)
      setIsLoading(false)
    }
  }, [isConnected, walletAddress])

  const checkUserProfile = async () => {
    try {
      setIsLoading(true)
      
      // Check if user exists in database
      const response = await fetch(`/api/user?address=${walletAddress}`)
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setHasProfile(true)
      } else if (response.status === 404) {
        // User doesn't exist, needs to create profile
        setUser(null)
        setHasProfile(false)
      } else {
        throw new Error('Failed to fetch user profile')
      }
    } catch (error) {
      console.error('Error checking user profile:', error)
      setUser(null)
      setHasProfile(false)
    } finally {
      setIsLoading(false)
    }
  }

  const createProfile = async (profileData: Partial<UserProfile>) => {
    try {
      setIsLoading(true)

      const newProfile = {
        ...profileData,
        ethAddress: walletType === 'ethereum' ? walletAddress : undefined,
        solAddress: walletType === 'solana' ? walletAddress : undefined,
        isVerified: false,
        role: 'VIEWER',
        isProfileComplete: true,
        canStream: false,
        streamingApproved: false,
        followerCount: 0,
        followingCount: 0
      }

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProfile)
      })

      if (!response.ok) {
        throw new Error('Failed to create profile')
      }

      const createdUser = await response.json()
      setUser(createdUser)
      setHasProfile(true)
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/user/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    if (walletAddress) {
      await checkUserProfile()
    }
  }

  const logout = () => {
    setUser(null)
    setHasProfile(false)
  }

  const contextValue: UserContextType = {
    user,
    isLoading,
    isConnected,
    walletAddress,
    walletType,
    hasProfile,
    isProfileSetupComplete,
    createProfile,
    updateProfile,
    refreshUser,
    logout
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 