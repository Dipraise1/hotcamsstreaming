'use client'

import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButtons } from '@/components/wallet/WalletButtons'
import { ProfileSetup } from '@/components/ProfileSetup'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Wallet, User, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: (user: any) => void
}

type OnboardingStep = 'connect-wallet' | 'profile-setup' | 'dashboard-ready' | 'loading'

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('connect-wallet')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ethereum wallet
  const { address: ethAddress, isConnected: isEthConnected } = useAccount()
  
  // Solana wallet
  const { publicKey: solPublicKey, connected: isSolConnected } = useWallet()

  const isWalletConnected = isEthConnected || isSolConnected
  const walletAddress = ethAddress || solPublicKey?.toString() || null
  const walletType = isEthConnected ? 'ethereum' : isSolConnected ? 'solana' : null

  useEffect(() => {
    if (isWalletConnected && walletAddress && currentStep === 'connect-wallet') {
      checkUserProfile()
    } else if (!isWalletConnected && currentStep !== 'connect-wallet') {
      // Wallet disconnected, reset to start
      setCurrentStep('connect-wallet')
      setUser(null)
      setError(null)
    }
  }, [isWalletConnected, walletAddress])

  const checkUserProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setCurrentStep('loading')

      console.log('Checking user profile for address:', walletAddress)
      const response = await fetch(`/api/user?address=${walletAddress}`)
      console.log('API response status:', response.status)
      
      if (response.ok) {
        const userData = await response.json()
        console.log('User data received:', userData)
        setUser(userData)
        setCurrentStep('dashboard-ready')
      } else if (response.status === 404) {
        // User doesn't exist, needs to create profile
        console.log('User not found, showing profile setup')
        setCurrentStep('profile-setup')
      } else {
        const errorText = await response.text()
        console.error('API error:', response.status, errorText)
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error('Error checking user profile:', error)
      setError('Failed to check profile. Please try again.')
      setCurrentStep('connect-wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileComplete = async (profileData: any) => {
    try {
      setIsLoading(true)
      setError(null)

      const payload = {
        ...profileData,
        ethAddress: walletType === 'ethereum' ? walletAddress : undefined,
        solAddress: walletType === 'solana' ? walletAddress : undefined
      }

      console.log('Creating profile with payload:', payload)

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log('Profile creation response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Profile creation error:', errorData)
        throw new Error(errorData.error || 'Failed to create profile')
      }

      const createdUser = await response.json()
      console.log('Profile created successfully:', createdUser)
      setUser(createdUser)
      setCurrentStep('dashboard-ready')
    } catch (error: any) {
      console.error('Error creating profile:', error)
      setError(error.message || 'Failed to create profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueToDashboard = () => {
    if (user) {
      onComplete(user)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'connect-wallet':
        return (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to HotCams</h1>
              <p className="text-gray-400 mb-2">The premier decentralized adult entertainment platform</p>
              <div className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                18+ ONLY
              </div>
            </div>

            <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800">
              <WalletButtons />
              
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  New to crypto wallets? 
                  <a href="#" className="text-pink-400 hover:text-pink-300 ml-1">Learn how to get started</a>
                </p>
              </div>
            </Card>
          </div>
        )

      case 'loading':
        return (
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Checking your profile...</h2>
            <p className="text-gray-400">Please wait while we verify your account</p>
          </div>
        )

      case 'profile-setup':
        return (
          <div className="w-full">
            <ProfileSetup onComplete={handleProfileComplete} />
          </div>
        )

      case 'dashboard-ready':
        return (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-gray-400">Your profile is ready. Let's get started!</p>
            </div>

            <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800">
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {user?.displayName || user?.username}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {user?.role === 'PERFORMER' ? 'Performer Account' : 'Viewer Account'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Wallet</div>
                    <div className="text-sm text-white font-mono">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </div>
                  </div>
                </div>

                {user?.role === 'PERFORMER' && user?.performerProfile && (
                  <div className="p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">🎭 Performer Profile</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>Stage Name: {user.performerProfile.stageName}</div>
                      <div>Category: {user.performerProfile.category.replace('_', ' ')}</div>
                      <div>Private Rate: {user.performerProfile.privateShowRate} ETH/min</div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleContinueToDashboard}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Continue to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Ready to explore the future of adult entertainment
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 ${
              ['connect-wallet', 'loading'].includes(currentStep) ? 'text-pink-500' : 'text-green-500'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['connect-wallet', 'loading'].includes(currentStep) 
                  ? 'bg-pink-500' 
                  : 'bg-green-500'
              }`}>
                {['connect-wallet', 'loading'].includes(currentStep) ? (
                  <Wallet className="w-4 h-4 text-white" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-sm font-medium">Connect Wallet</span>
            </div>

            <div className={`w-8 h-1 rounded-full ${
              ['profile-setup', 'dashboard-ready'].includes(currentStep) 
                ? 'bg-pink-500' 
                : 'bg-gray-700'
            }`} />

            <div className={`flex items-center space-x-2 ${
              currentStep === 'profile-setup' ? 'text-pink-500' : 
              currentStep === 'dashboard-ready' ? 'text-green-500' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'profile-setup' ? 'bg-pink-500' : 
                currentStep === 'dashboard-ready' ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                {currentStep === 'dashboard-ready' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-sm font-medium">Setup Profile</span>
            </div>

            <div className={`w-8 h-1 rounded-full ${
              currentStep === 'dashboard-ready' ? 'bg-pink-500' : 'bg-gray-700'
            }`} />

            <div className={`flex items-center space-x-2 ${
              currentStep === 'dashboard-ready' ? 'text-pink-500' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'dashboard-ready' ? 'bg-pink-500' : 'bg-gray-700'
              }`}>
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}
      </div>
    </div>
  )
} 