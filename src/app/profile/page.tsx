'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, 
  Video, 
  Settings, 
  Edit, 
  Upload, 
  Play, 
  Square, 
  Users, 
  Heart, 
  Eye, 
  Star,
  Crown,
  Gift,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Sparkles,
  Save,
  X
} from 'lucide-react'

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamCategory, setStreamCategory] = useState('cam_girls')
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [currentViewers, setCurrentViewers] = useState(0)
  const [streamDuration, setStreamDuration] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

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
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1)
        setCurrentViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStreaming])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      streamRef.current = stream
      setIsCameraOn(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please ensure you have granted camera permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCameraOn(false)
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !isMicOn
      })
      setIsMicOn(!isMicOn)
    }
  }

  const startStream = async () => {
    if (!isCameraOn) {
      await startCamera()
    }
    
    setIsStreaming(true)
    setCurrentViewers(Math.floor(Math.random() * 50) + 10)
    setStreamDuration(0)
    
    // In real app, this would create a stream via Livepeer API
    console.log('Starting stream with title:', streamTitle)
  }

  const stopStream = () => {
    setIsStreaming(false)
    stopCamera()
    setCurrentViewers(0)
    setStreamDuration(0)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={profile.avatar || '/default-avatar.png'}
                    alt={profile.displayName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg shadow-pink-500/25"
                  />
                  {profile.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full">
                      <Crown className="w-5 h-5" />
                    </div>
                  )}
                  {isStreaming && (
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      LIVE
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {profile.performerProfile?.stageName || profile.displayName}
                </h1>
                
                <p className="text-gray-400 mb-2">@{profile.username}</p>
                
                {profile.performerProfile && (
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                      {profile.performerProfile.age} years
                    </Badge>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>{profile.performerProfile.rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}
                
                <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>
                
                <div className="flex items-center justify-center text-gray-400 text-sm mb-6">
                  <span>📍 {profile.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-400">{profile.followerCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{profile.followingCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
              </div>

              {profile.performerProfile && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{profile.performerProfile.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Views</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{profile.performerProfile.ratingCount}</div>
                    <div className="text-sm text-gray-400">Reviews</div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {profile.performerProfile && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.performerProfile.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                
                {profile.canStream && (
                  <Button 
                    onClick={isStreaming ? stopStream : () => setStreamTitle('Live Stream')}
                    className={`w-full ${
                      isStreaming 
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    }`}
                  >
                    {isStreaming ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Stop Stream
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Go Live
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Stream & Content */}
          <div className="lg:col-span-2">
            {/* Stream Setup */}
            {!isStreaming && profile.canStream && streamTitle && (
              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-pink-400" />
                  Stream Setup
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stream Title</label>
                    <input
                      type="text"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="What's your stream about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={streamCategory}
                      onChange={(e) => setStreamCategory(e.target.value)}
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
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={isCameraOn ? stopCamera : startCamera}
                      variant="outline"
                      className={`flex-1 ${isCameraOn ? 'border-green-500 text-green-400' : 'border-gray-600'}`}
                    >
                      {isCameraOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                      {isCameraOn ? 'Camera On' : 'Test Camera'}
                    </Button>
                    
                    <Button
                      onClick={startStream}
                      disabled={!streamTitle.trim()}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Stream
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Live Stream Interface */}
            {isStreaming && (
              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 mb-6">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{currentViewers} viewers</span>
                      </div>
                      <div className="text-gray-300">
                        {formatDuration(streamDuration)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={toggleMic}
                        size="sm"
                        variant="outline"
                        className={`${isMicOn ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
                      >
                        {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        onClick={stopStream}
                        size="sm"
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="relative aspect-video bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">{streamTitle}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {currentViewers}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {Math.floor(currentViewers * 0.3)}
                          </span>
                        </div>
                        
                        <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold">
                          <Gift className="w-4 h-4 mr-1" />
                          Tip Goal: 10 ETH
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Camera Preview */}
            {isCameraOn && !isStreaming && (
              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 mb-6">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="font-bold flex items-center">
                    <Monitor className="w-5 h-5 mr-2 text-green-400" />
                    Camera Preview
                  </h3>
                </div>
                
                <div className="relative aspect-video bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}

            {/* Content Gallery */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                    My Content
                  </h2>
                  
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>

                {/* Photos */}
                {profile.performerProfile?.photos && profile.performerProfile.photos.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {profile.performerProfile.photos.map((photo, index) => (
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
                )}

                {/* Videos */}
                {profile.performerProfile?.videos && profile.performerProfile.videos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.performerProfile.videos.map((video, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                          <video
                            src={video}
                            className="w-full h-full object-cover"
                            poster="/default-video-thumbnail.jpg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {Math.floor(Math.random() * 10) + 1}:30
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 