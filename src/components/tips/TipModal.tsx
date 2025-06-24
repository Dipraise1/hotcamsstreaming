"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Gift, Zap, Wallet, AlertCircle, Check } from 'lucide-react'
import { useAccount, useSendTransaction } from 'wagmi'
import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react'
import { parseEther } from 'viem'
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js'

interface TipModalProps {
  isOpen: boolean
  onClose: () => void
  streamerAddress: string
  streamerName: string
  streamerAvatar?: string
}

const tipAmounts = [
  { value: 0.01, label: '$10' },
  { value: 0.05, label: '$50' },
  { value: 0.1, label: '$100' },
  { value: 0.5, label: '$500' },
]

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum', color: 'from-blue-500 to-purple-600' },
  { symbol: 'SOL', name: 'Solana', chain: 'solana', color: 'from-purple-400 to-purple-600' },
  { symbol: 'USDC', name: 'USD Coin', chain: 'both', color: 'from-blue-400 to-blue-600' },
]

export function TipModal({ isOpen, onClose, streamerAddress, streamerName, streamerAvatar }: TipModalProps) {
  const [selectedToken, setSelectedToken] = useState('ETH')
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Ethereum wallet
  const { address: ethAddress, isConnected: isEthConnected } = useAccount()
  const { sendTransaction } = useSendTransaction()
  
  // Solana wallet
  const { publicKey: solPublicKey, sendTransaction: sendSolTransaction } = useSolanaWallet()
  const { connection } = useConnection()

  const isWalletConnected = isEthConnected || !!solPublicKey
  const currentTipAmount = customAmount || amount

  const handleTipAmountSelect = (value: number) => {
    setAmount(value.toString())
    setCustomAmount('')
  }

  const handleSendTip = async () => {
    if (!currentTipAmount || !isWalletConnected) return

    setIsProcessing(true)
    
    try {
      if (selectedToken === 'ETH' || (selectedToken === 'USDC' && isEthConnected)) {
        // Ethereum transaction
        await sendEthereumTip()
      } else if (selectedToken === 'SOL' || (selectedToken === 'USDC' && solPublicKey)) {
        // Solana transaction  
        await sendSolanaTip()
      }
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      console.error('Tip failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const sendEthereumTip = async () => {
    if (!ethAddress) return
    
    const transaction = {
      to: streamerAddress as `0x${string}`,
      value: parseEther(currentTipAmount),
    }
    
    await sendTransaction(transaction)
  }

  const sendSolanaTip = async () => {
    if (!solPublicKey) return
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: solPublicKey,
        toPubkey: new PublicKey(streamerAddress),
        lamports: parseFloat(currentTipAmount) * LAMPORTS_PER_SOL,
      })
    )
    
    const signature = await sendSolTransaction(transaction, connection)
    await connection.confirmTransaction(signature, 'processed')
  }

  const resetForm = () => {
    setAmount('')
    setCustomAmount('')
    setMessage('')
    setSuccess(false)
    setIsProcessing(false)
  }

  const getTokensByChain = () => {
    if (isEthConnected && solPublicKey) {
      return tokens // Both wallets connected, show all tokens
    } else if (isEthConnected) {
      return tokens.filter(t => t.chain === 'ethereum' || t.chain === 'both')
    } else if (solPublicKey) {
      return tokens.filter(t => t.chain === 'solana' || t.chain === 'both')
    }
    return []
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tip Sent Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your {currentTipAmount} {selectedToken} tip has been sent to {streamerName}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2 text-purple-600" />
            Send a Tip
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Streamer Info */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            {streamerAvatar && (
              <img
                src={streamerAvatar}
                alt={streamerName}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Tipping {streamerName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Show your support with crypto
              </p>
            </div>
          </div>

          {!isWalletConnected ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please connect a wallet to send tips
              </p>
            </div>
          ) : (
            <>
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Token
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {getTokensByChain().map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => setSelectedToken(token.symbol)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedToken === token.symbol
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${token.color} rounded-full mx-auto mb-2`} />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {token.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tip Amount
                </label>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {tipAmounts.map((tip) => (
                    <button
                      key={tip.value}
                      onClick={() => handleTipAmountSelect(tip.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        amount === tip.value.toString()
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {tip.value} {selectedToken}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {tip.label}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Custom Amount */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder={`Custom amount in ${selectedToken}`}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setAmount('')
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    step="0.001"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    {selectedToken}
                  </div>
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (optional)
                </label>
                <textarea
                  placeholder="Leave a message for the streamer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {message.length}/200 characters
                </div>
              </div>

              {/* Transaction Warning */}
              <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">Transaction Note</p>
                  <p>
                    This transaction will be processed on the {selectedToken === 'SOL' ? 'Solana' : 'Ethereum'} blockchain. 
                    Please ensure you have enough {selectedToken === 'SOL' ? 'SOL' : 'ETH'} for gas fees.
                  </p>
                </div>
              </div>

              {/* Send Button */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendTip}
                  disabled={!currentTipAmount || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Send {currentTipAmount} {selectedToken}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 