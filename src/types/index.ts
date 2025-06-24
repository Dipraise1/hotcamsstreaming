export interface User {
  id: string
  walletAddress: string
  walletType: 'solana' | 'ethereum'
  username?: string
  bio?: string
  profileImage?: string
  preferredTipToken: 'ETH' | 'SOL' | 'USDC'
  preferredChain: 'solana' | 'ethereum'
  createdAt: Date
  updatedAt: Date
}

export interface Stream {
  id: string
  title: string
  description?: string
  creatorId: string
  creator: User
  playbackId: string
  streamKey: string
  isLive: boolean
  category?: string
  tags?: string[]
  thumbnailUrl?: string
  viewerCount: number
  totalTips: number
  createdAt: Date
  updatedAt: Date
}

export interface Tip {
  id: string
  streamId: string
  fromUserId: string
  toUserId: string
  amount: number
  token: 'ETH' | 'SOL' | 'USDC'
  transactionHash: string
  message?: string
  createdAt: Date
}

export interface WalletContextType {
  isConnected: boolean
  address: string | null
  walletType: 'solana' | 'ethereum' | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: string) => Promise<string>
}

export interface StreamContextType {
  streams: Stream[]
  currentStream: Stream | null
  isLoading: boolean
  createStream: (data: Partial<Stream>) => Promise<Stream>
  updateStream: (id: string, data: Partial<Stream>) => Promise<void>
  deleteStream: (id: string) => Promise<void>
  fetchStreams: () => Promise<void>
  goLive: (streamId: string) => Promise<void>
  endStream: (streamId: string) => Promise<void>
}

export interface TipContextType {
  tips: Tip[]
  isLoading: boolean
  sendTip: (data: Omit<Tip, 'id' | 'createdAt'>) => Promise<void>
  fetchTips: (streamId?: string) => Promise<void>
} 