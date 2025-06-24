"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import StreamingStudio from '@/components/StreamingStudio'
import { CameraTest } from '@/components/CameraTest'
import { 
  Video, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Settings, 
  Play, 
  Pause,
  Gift,
  Calendar,
  Clock,
  BarChart3,
  Crown,
  Camera,
  Lock,
  Heart,
  Star,
  Copy,
  CheckCircle,
  AlertCircle,
  Edit,
  Upload,
  Sparkles,
  User,
  Image,
  FileVideo
} from 'lucide-react'

// Mock Livepeer integration - replace with actual Livepeer SDK
interface StreamData {
  streamKey: string
  playbackId: string
  rtmpIngestUrl: string
  isActive: boolean
}

interface UserProfile {
  id: string
  username: string
  displayName?: string
  avatar?: string
  bio?: string
  location?: string
  isVerified: boolean
  canStream: boolean
  streamingApproved: boolean
  performerProfile?: {
    stageName: string
    age: number
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

interface Analytics {
  today: {
    views: number
    tips: number
    newFollowers: number
    streamTime: number
  }
  thisWeek: {
    views: number
    tips: number
    newFollowers: number
    streamTime: number
  }
  thisMonth: {
    views: number
    tips: number
    newFollowers: number
    streamTime: number
  }
}

export default function DashboardPage() {
  const [isLive, setIsLive] = useState(false)
  const [showGoLiveDialog, setShowGoLiveDialog] = useState(false)
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamCategory, setStreamCategory] = useState('Cam Girls')
  const [streamTags, setStreamTags] = useState('')
  const [privateRate, setPrivateRate] = useState(8)
  const [copied, setCopied] = useState(false)
  const [isCreatingStream, setIsCreatingStream] = useState(false)
  
  // Real-time stats simulation
  const [liveStats, setLiveStats] = useState({
    viewers: 0,
    tips: 0,
    duration: 0
  })

  // Mock performer data
  const performerStats = {
    totalEarnings: 2847.50,
    todayEarnings: 184.25,
    totalViews: 125420,
    followers: 8943,
    rating: 4.8,
    privateShows: 47,
    totalTips: 523
  }

  const recentEarnings = [
    { date: "2024-01-20", amount: 184.25, currency: "ETH", type: "Tips" },
    { date: "2024-01-20", amount: 95.00, currency: "SOL", type: "Private Show" },
    { date: "2024-01-19", amount: 234.50, currency: "USDC", type: "Tips" },
    { date: "2024-01-19", amount: 150.00, currency: "ETH", type: "Private Show" },
    { date: "2024-01-18", amount: 89.75, currency: "SOL", type: "Tips" }
  ]

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Simulate creating a stream with Livepeer
  const createStream = async () => {
    setIsCreatingStream(true)
    
    // Simulate API call to Livepeer
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockStreamData: StreamData = {
      streamKey: `sk_${Math.random().toString(36).substring(2, 15)}`,
      playbackId: `pb_${Math.random().toString(36).substring(2, 15)}`,
      rtmpIngestUrl: "rtmp://rtmp.livepeer.com/live",
      isActive: false
    }
    
    setStreamData(mockStreamData)
    setIsCreatingStream(false)
    return mockStreamData
  }

  const handleGoLive = async () => {
    if (!streamData) {
      await createStream()
    }
    
    setIsLive(true)
    setShowGoLiveDialog(false)
    
    // Start live stats simulation
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        viewers: Math.max(0, prev.viewers + Math.floor(Math.random() * 10) - 4),
        tips: prev.tips + Math.random() * 2,
        duration: prev.duration + 1
      }))
    }, 1000)

    // Store interval reference to clear later
    ;(window as any).statsInterval = statsInterval
  }

  const handleStopStream = () => {
    setIsLive(false)
    setLiveStats({ viewers: 0, tips: 0, duration: 0 })
    
    // Clear stats interval
    if ((window as any).statsInterval) {
      clearInterval((window as any).statsInterval)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize stream on component mount
  useEffect(() => {
    createStream()
    
    return () => {
      if ((window as any).statsInterval) {
        clearInterval((window as any).statsInterval)
      }
    }
  }, [])

  useEffect(() => {
    // Mock user profile data - in real app, fetch from API
    setProfile({
      id: '1',
      username: 'sexyangel23',
      displayName: 'Angel Rose',
      avatar: '/photo_2022-11-08 23.56.28.jpeg',
      bio: 'Hey there! I\'m Angel, your favorite girl next door 💕 I love to chat and have fun! Come say hi!',
      location: 'Los Angeles, CA',
      isVerified: true,
      canStream: true,
      streamingApproved: true,
      performerProfile: {
        stageName: 'Angel Rose',
        age: 24,
        category: 'cam_girls',
        tags: ['blonde', 'petite', 'interactive', 'friendly', 'new'],
        photos: ['/photo_2022-11-08 23.56.28.jpeg', '/photo_2022-11-09 22.06.24.jpeg'],
        videos: ['/IMG_9318.MP4', '/IMG_9352.MOV'],
        privateShowRate: 0.005,
        totalViews: 125000,
        rating: 4.8,
        ratingCount: 342,
        totalEarnings: 15.5
      },
      followerCount: 2850,
      followingCount: 120
    })

    // Mock analytics data
    setAnalytics({
      today: {
        views: 1250,
        tips: 2.3,
        newFollowers: 15,
        streamTime: 180 // minutes
      },
      thisWeek: {
        views: 8900,
        tips: 18.7,
        newFollowers: 89,
        streamTime: 1260
      },
      thisMonth: {
        views: 35000,
        tips: 78.2,
        newFollowers: 320,
        streamTime: 5400
      }
    })
  }, [])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'stream', name: 'Go Live', icon: Video },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'content', name: 'Content', icon: Image },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  if (!profile || !analytics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt={profile.displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Welcome back, {profile.performerProfile?.stageName || profile.displayName}!
              </h1>
              <p className="text-gray-400">@{profile.username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {profile.isVerified && (
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Crown className="w-4 h-4 mr-1" />
                Verified
              </Badge>
            )}
            {isStreaming && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                🔴 LIVE
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Views</p>
                <p className="text-2xl font-bold text-pink-400">{analytics.today.views.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-pink-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Tips</p>
                <p className="text-2xl font-bold text-green-400">{analytics.today.tips.toFixed(2)} ETH</p>
              </div>
              <Gift className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Followers</p>
                <p className="text-2xl font-bold text-purple-400">{analytics.today.newFollowers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Stream Time</p>
                <p className="text-2xl font-bold text-blue-400">{formatTime(analytics.today.streamTime)}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
              } px-6 py-3 rounded-full font-medium transition-all`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pink-400" />
                Performance Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-300">Today</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views:</span>
                      <span className="text-white">{analytics.today.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tips:</span>
                      <span className="text-green-400">{analytics.today.tips.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Followers:</span>
                      <span className="text-purple-400">+{analytics.today.newFollowers}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-300">This Week</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views:</span>
                      <span className="text-white">{analytics.thisWeek.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tips:</span>
                      <span className="text-green-400">{analytics.thisWeek.tips.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Followers:</span>
                      <span className="text-purple-400">+{analytics.thisWeek.newFollowers}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-300">This Month</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views:</span>
                      <span className="text-white">{analytics.thisMonth.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tips:</span>
                      <span className="text-green-400">{analytics.thisMonth.tips.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Followers:</span>
                      <span className="text-purple-400">+{analytics.thisMonth.newFollowers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => setActiveTab('stream')}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 p-6 h-auto"
                >
                  <div className="text-center">
                    <Video className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Go Live</div>
                    <div className="text-sm opacity-80">Start streaming now</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('content')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-6 h-auto"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Upload Content</div>
                    <div className="text-sm opacity-80">Add photos & videos</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('profile')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-6 h-auto"
                >
                  <div className="text-center">
                    <Edit className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Edit Profile</div>
                    <div className="text-sm opacity-80">Update your info</div>
                  </div>
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'stream' && (
          <div className="space-y-6">
            <CameraTest />
            <StreamingStudio 
              userProfile={profile}
              onStreamStart={(streamData) => {
                setIsStreaming(true)
                console.log('Stream started:', streamData)
              }}
              onStreamEnd={() => {
                setIsStreaming(false)
                console.log('Stream ended')
              }}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-pink-400" />
              Profile Settings
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stage Name</label>
                  <input
                    type="text"
                    value={profile.performerProfile?.stageName || ''}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profile.bio || ''}
                    rows={4}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={profile.performerProfile?.category || ''}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="cam_girls">Cam Girls</option>
                    <option value="couples">Couples</option>
                    <option value="cam_boys">Cam Boys</option>
                    <option value="trans">Trans</option>
                    <option value="mature">Mature</option>
                    <option value="fetish_bdsm">Fetish & BDSM</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Private Show Rate (ETH/min)</label>
                  <input
                    type="number"
                    value={profile.performerProfile?.privateShowRate || 0}
                    step="0.001"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.performerProfile?.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-pink-500 text-pink-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'content' && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Image className="w-5 h-5 mr-2 text-pink-400" />
              Content Management
            </h2>
            
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Upload New Content</h3>
                <p className="text-gray-400 mb-4">Drag and drop your photos or videos here</p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                    <Image className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <FileVideo className="w-4 h-4 mr-2" />
                    Upload Videos
                  </Button>
                </div>
              </div>
              
              {/* Existing Content */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Content</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {profile.performerProfile?.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-pink-400" />
              Analytics & Insights
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Earnings Overview</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {profile.performerProfile?.totalEarnings.toFixed(2)} ETH
                  </div>
                  <div className="text-sm text-gray-400">Total Earnings</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Views:</span>
                    <span className="text-white font-semibold">{profile.performerProfile?.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white font-semibold">{profile.performerProfile?.rating.toFixed(1)}</span>
                      <span className="text-gray-400 ml-1">({profile.performerProfile?.ratingCount} reviews)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Followers:</span>
                    <span className="text-white font-semibold">{profile.followerCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-pink-400" />
              Account Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-gray-700 rounded-full p-1 transition-colors">
                      <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                    <span className="ml-3 text-white">Show online status</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-gray-700 rounded-full p-1 transition-colors">
                      <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                    <span className="ml-3 text-white">Allow private messages</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Streaming Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="w-10 h-6 bg-pink-600 rounded-full p-1 transition-colors">
                      <div className="w-4 h-4 bg-white rounded-full translate-x-4 transition-transform" />
                    </div>
                    <span className="ml-3 text-white">Allow private shows</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-gray-700 rounded-full p-1 transition-colors">
                      <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                    <span className="ml-3 text-white">Auto-accept private shows</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 