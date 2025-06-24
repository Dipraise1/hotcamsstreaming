"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WalletContextType } from '@/types'

// Solana imports
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

// Ethereum imports
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'

const WalletContext = createContext<WalletContextType | null>(null)

// Solana configuration
const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)
const wallets = [new PhantomWalletAdapter()]

// Ethereum configuration
const config = getDefaultConfig({
  appName: 'HotCams',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'fallback-project-id',
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})

const queryClient = new QueryClient()

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<'solana' | 'ethereum' | null>(null)

  const connect = async () => {
    // This will be handled by the individual wallet buttons
  }

  const disconnect = async () => {
    setIsConnected(false)
    setAddress(null)
    setWalletType(null)
  }

  const signMessage = async (message: string): Promise<string> => {
    // Implementation will depend on the connected wallet type
    return ''
  }

  const contextValue: WalletContextType = {
    isConnected,
    address,
    walletType,
    connect,
    disconnect,
    signMessage,
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <WalletContext.Provider value={contextValue}>
                  {children}
                </WalletContext.Provider>
              </WalletModalProvider>
            </SolanaWalletProvider>
          </ConnectionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 