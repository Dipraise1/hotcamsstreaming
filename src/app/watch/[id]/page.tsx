"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LivePlayer } from '@/components/LivePlayer'
import { TipModal } from '@/components/tips/TipModal'
import { 
  Heart, 
  Share, 
  Flag, 
  Users, 
  Gift,
  Crown,
  MessageCircle,
  Lock,
  Star
} from 'lucide-react'

// Mock stream data - in real app, this would come from API
const getStreamData = (id: string) => ({
  id,
  title: "Sensual Evening Show 💕",
  performer: {
    name: "AngelaBaby",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c6c3?w=100&h=100&fit=crop&crop=face",
    age: "22",
    rating: 4.8,
    followers: 8943,
    isVerified: true
  },
  playbackId: `pb_${id}`,
  viewers: 1247,
  isLive: true,
  category: "Cam Girls",
  tags: ["interactive", "toys", "brunette"],
  isPrivateAvailable: true,
  privateCost: 8,
  totalTips: 234.5,
  streamStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
})

export default function WatchPage() {
  const params = useParams()
  const streamId = params.id as string
  
  const [streamData, setStreamData] = useState(getStreamData(streamId))
  const [showTipModal, setShowTipModal] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "CryptoFan123", message: "Amazing show! 🔥", time: "2 min ago", isVip: false },
    { id: 2, user: "VIPMember", message: "Private show later?", time: "3 min ago", isVip: true },
    { id: 3, user: "TipKing", message: "Just sent 5 ETH! 💎", time: "5 min ago", isVip: false },
  ])

  const handleTip = (amount: number, currency: string) => {
    console.log(`Tipping ${amount} ${currency} to ${streamData.performer.name}`)
    setShowTipModal(false)
    // Here you would integrate with wallet to send the tip
  }

  const handlePrivateShow = () => {
    console.log(`Requesting private show with ${streamData.performer.name}`)
    // Here you would initiate private show request
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    
    const newMessage = {
      id: chatMessages.length + 1,
      user: "You",
      message: chatMessage,
      time: "now",
      isVip: false
    }
    
    setChatMessages([...chatMessages, newMessage])
    setChatMessage('')
  }

  const formatStreamDuration = () => {
    const duration = Date.now() - streamData.streamStartTime.getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamData(prev => ({
        ...prev,
        viewers: Math.max(100, prev.viewers + Math.floor(Math.random() * 20) - 10)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-red-900/10 dark:to-purple-900/20">
      {/* Adult Content Banner */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-sm">
            <Lock className="w-4 h-4 mr-2" />
            <span className="font-medium">18+ ADULT CONTENT</span>
            <span className="mx-2">•</span>
            <span>Viewer discretion advised</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            <LivePlayer
              playbackId={streamData.playbackId}
              streamTitle={streamData.title}
              performerName={streamData.performer.name}
              viewers={streamData.viewers}
              isLive={streamData.isLive}
              onTip={() => setShowTipModal(true)}
              onPrivateShow={handlePrivateShow}
              isPrivateAvailable={streamData.isPrivateAvailable}
              privateCost={streamData.privateCost}
            />

            {/* Performer Info */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={streamData.performer.avatar}
                      alt={streamData.performer.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {streamData.performer.name}
                        </h2>
                        {streamData.performer.isVerified && (
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                            ✓ Verified
                          </div>
                        )}
                        <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-300">
                          18+ Verified
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Age: {streamData.performer.age}</span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {streamData.performer.rating}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {streamData.performer.followers.toLocaleString()} followers
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {streamData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isFollowing ? "default" : "outline"}
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={isFollowing ? "bg-red-600 hover:bg-red-700" : "border-red-300 text-red-600 hover:bg-red-50"}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stream Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {streamData.viewers.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Viewers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${streamData.totalTips}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Tips</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatStreamDuration()}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stream Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {streamData.category}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-medium ${msg.isVip ? 'text-yellow-600' : 'text-gray-900 dark:text-white'}`}>
                          {msg.isVip && <Crown className="w-3 h-3 inline mr-1" />}
                          {msg.user}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 break-words">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Send
                    </Button>
                  </div>
                  <div className="flex justify-center mt-3">
                    <Button 
                      size="sm" 
                      onClick={() => setShowTipModal(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Send Tip
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => setShowTipModal(true)}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Send Tip
                </Button>
                {streamData.isPrivateAvailable && (
                  <Button 
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    onClick={handlePrivateShow}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Private Show ({streamData.privateCost} ETH/min)
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      <TipModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        recipientName={streamData.performer.name}
        onTip={handleTip}
      />
    </div>
  )
} 