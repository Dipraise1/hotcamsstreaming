"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Wallet, Zap } from 'lucide-react'
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { formatWalletAddress } from '@/lib/utils'

export function PhantomButton() {
  const { publicKey, connected, connect, disconnect } = useSolanaWallet()

  const handleClick = async () => {
    if (connected) {
      await disconnect()
    } else {
      await connect()
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full flex items-center justify-center gap-3 h-12 bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0 hover:from-purple-600 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <Zap className="w-4 h-4 text-purple-600" />
      </div>
      <span className="font-medium">
        {connected 
          ? `Phantom ${formatWalletAddress(publicKey?.toString() || '')}`
          : 'Connect Phantom'
        }
      </span>
    </Button>
  )
}

export function MetaMaskButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleClick = async () => {
    if (isConnected) {
      disconnect()
    } else {
      const metaMaskConnector = connectors.find(connector => 
        connector.name.toLowerCase().includes('metamask')
      )
      if (metaMaskConnector) {
        connect({ connector: metaMaskConnector })
      }
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full flex items-center justify-center gap-3 h-12 bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <Wallet className="w-4 h-4 text-orange-600" />
      </div>
      <span className="font-medium">
        {isConnected 
          ? `MetaMask ${formatWalletAddress(address || '')}`
          : 'Connect MetaMask'
        }
      </span>
    </Button>
  )
}

export function WalletButtons() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your preferred wallet to get started
        </p>
      </div>
      
      <div className="grid gap-4">
        <PhantomButton />
        <MetaMaskButton />
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        By connecting your wallet, you agree to our Terms of Service
      </div>
    </div>
  )
} 