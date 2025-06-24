"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Gift, 
  Heart, 
  Users,
  Crown,
  Lock,
  Settings
} from 'lucide-react'

interface LivePlayerProps {
  playbackId: string
  streamTitle: string
  performerName: string
  viewers: number
  isLive: boolean
  onTip?: (amount: number, currency: string) => void
  onPrivateShow?: () => void
  isPrivateAvailable?: boolean
  privateCost?: number
}

export function LivePlayer({
  playbackId,
  streamTitle,
  performerName,
  viewers,
  isLive,
  onTip,
  onPrivateShow,
  isPrivateAvailable = false,
  privateCost = 8
}: LivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showTipDialog, setShowTipDialog] = useState(false)
  const [tipAmount, setTipAmount] = useState(5)
  const [tipCurrency, setTipCurrency] = useState('ETH')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // HLS URL for Livepeer
  const hlsUrl = `https://livepeercdn.com/hls/${playbackId}/index.m3u8`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Load HLS.js for browser compatibility
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = hlsUrl
    } else {
      // Use HLS.js for other browsers
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(hlsUrl)
          hls.attachMedia(video)
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded')
          })

          return () => {
            hls.destroy()
          }
        }
      }).catch(err => {
        console.error('Failed to load HLS.js:', err)
      })
    }
  }, [hlsUrl])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current
    if (!video) return

    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      video.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleTip = () => {
    if (onTip) {
      onTip(tipAmount, tipCurrency)
      setShowTipDialog(false)
    }
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Player */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isLive && (
                <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                  LIVE
                </div>
              )}
              <div className="px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {viewers.toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 w-16 h-16 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 bg-red-600/80"
                  >
                    <Gift className="w-4 h-4 mr-1" />
                    Tip
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Tip to {performerName}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount</label>
                      <input
                        type="number"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(Number(e.target.value))}
                        min="1"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Currency</label>
                      <select
                        value={tipCurrency}
                        onChange={(e) => setTipCurrency(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="ETH">ETH</option>
                        <option value="SOL">SOL</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>
                    <Button onClick={handleTip} className="w-full bg-red-600 hover:bg-red-700">
                      <Gift className="w-4 h-4 mr-2" />
                      Send Tip ({tipAmount} {tipCurrency})
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {isPrivateAvailable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 bg-yellow-600/80"
                  onClick={onPrivateShow}
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Private
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {!isLive && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Stream Offline</p>
              <p className="text-sm opacity-75">This performer is not currently live</p>
            </div>
          </div>
        )}
      </div>

      {/* Stream Info */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {streamTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {performerName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {viewers.toLocaleString()} viewers
                </p>
                {isPrivateAvailable && (
                  <p className="text-xs text-yellow-600">
                    Private: {privateCost} ETH/min
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 