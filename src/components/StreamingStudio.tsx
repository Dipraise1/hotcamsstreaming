'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Camera, 
  Video, 
  VideoOff,
  Mic, 
  MicOff,
  Monitor,
  Settings,
  Play,
  Square,
  Users,
  Eye,
  Heart,
  Gift,
  Share,
  Maximize,
  Volume2,
  VolumeX,
  Sparkles,
  Crown
} from 'lucide-react'

interface StreamingStudioProps {
  onStreamStart?: (streamData: any) => void
  onStreamEnd?: () => void
  userProfile?: any
}

export default function StreamingStudio({ onStreamStart, onStreamEnd, userProfile }: StreamingStudioProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [currentViewers, setCurrentViewers] = useState(0)
  const [streamDuration, setStreamDuration] = useState(0)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamCategory, setStreamCategory] = useState('cam_girls')
  const [streamTags, setStreamTags] = useState<string[]>([])
  const [tipGoal, setTipGoal] = useState(10)
  const [currentTips, setCurrentTips] = useState(0)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [streamKey, setStreamKey] = useState('')
  const [rtmpUrl, setRtmpUrl] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const categories = [
    { id: 'cam_girls', name: 'Cam Girls', icon: '💋' },
    { id: 'couples', name: 'Couples', icon: '💕' },
    { id: 'cam_boys', name: 'Cam Boys', icon: '💪' },
    { id: 'trans', name: 'Trans', icon: '🌈' },
    { id: 'mature', name: 'Mature', icon: '🍷' },
    { id: 'fetish_bdsm', name: 'Fetish & BDSM', icon: '⛓️' }
  ]

  const popularTags = [
    'new', 'interactive', 'friendly', 'toys', 'dance', 'talk', 'music', 'games',
    'roleplay', 'cosplay', 'fetish', 'domination', 'submission', 'feet', 'anal',
    'squirt', 'cum', 'deepthroat', 'blowjob', 'dildo', 'vibrator', 'lovense'
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1)
        setCurrentViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
        setCurrentTips(prev => prev + Math.random() * 0.01)
        
        // Simulate chat messages
        if (Math.random() < 0.3) {
          const messages = [
            'Hey beautiful! 😍',
            'You look amazing today!',
            'Can you dance for us?',
            'Love your outfit! 💕',
            'Tip sent! 💰',
            'Hello from Germany! 🇩🇪',
            'You have beautiful eyes!',
            'Can you say hi to me?'
          ]
          const randomMessage = messages[Math.floor(Math.random() * messages.length)]
          const randomUser = `user${Math.floor(Math.random() * 1000)}`
          
          setChatMessages(prev => [...prev.slice(-20), {
            id: Date.now(),
            user: randomUser,
            message: randomMessage,
            timestamp: new Date(),
            isVip: Math.random() < 0.2
          }])
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStreaming])

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...')
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser')
      }
      
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      }
      
      console.log('Requesting media with constraints:', constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Camera access granted, stream:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(e => console.error('Video play error:', e))
      }
      
      streamRef.current = stream
      setIsCameraOn(true)
      
      // Generate mock stream credentials
      setStreamKey(`sk_${Math.random().toString(36).substr(2, 9)}`)
      setRtmpUrl(`rtmp://rtmp.livepeer.com/live`)
      
      console.log('Camera started successfully')
      
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      
      let errorMessage = 'Unable to access camera. '
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access in your browser settings and try again.'
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please connect a camera and try again.'
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.'
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera does not support the required settings.'
      } else {
        errorMessage += error.message || 'Unknown error occurred.'
      }
      
      alert(errorMessage)
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

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = isCameraOn
      })
      setIsCameraOn(!isCameraOn)
    }
  }

  const startStream = async () => {
    if (!isCameraOn) {
      await startCamera()
    }
    
    if (!streamTitle.trim()) {
      alert('Please enter a stream title')
      return
    }
    
    setIsStreaming(true)
    setCurrentViewers(Math.floor(Math.random() * 50) + 10)
    setStreamDuration(0)
    setCurrentTips(0)
    setChatMessages([])
    
    // In real app, this would create a stream via Livepeer API
    const streamData = {
      title: streamTitle,
      category: streamCategory,
      tags: streamTags,
      tipGoal: tipGoal,
      streamKey: streamKey,
      rtmpUrl: rtmpUrl
    }
    
    onStreamStart?.(streamData)
    
    // Start recording for stream
    if (streamRef.current && canvasRef.current) {
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current, {
          mimeType: 'video/webm;codecs=vp9,opus'
        })
        
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start(1000) // Record in 1-second chunks
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // In real app, send chunks to streaming server
            console.log('Stream chunk:', event.data.size, 'bytes')
          }
        }
      } catch (error) {
        console.error('Error starting stream recording:', error)
      }
    }
  }

  const stopStream = () => {
    setIsStreaming(false)
    setCurrentViewers(0)
    setStreamDuration(0)
    setCurrentTips(0)
    setChatMessages([])
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
    
    onStreamEnd?.()
  }

  const addTag = (tag: string) => {
    if (!streamTags.includes(tag) && streamTags.length < 10) {
      setStreamTags([...streamTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setStreamTags(streamTags.filter(t => t !== tag))
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

  const tipGoalProgress = (currentTips / tipGoal) * 100

  return (
    <div className="space-y-6">
      {/* Stream Setup */}
      {!isStreaming && (
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-pink-400" />
            Stream Setup
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stream Title *</label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="What's your stream about?"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1">{streamTitle.length}/100</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tip Goal (ETH)</label>
                <input
                  type="number"
                  value={tipGoal}
                  onChange={(e) => setTipGoal(Number(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (max 10)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {streamTags.map(tag => (
                    <span
                      key={tag}
                      className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm flex items-center cursor-pointer hover:bg-pink-700"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 12).map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      disabled={streamTags.includes(tag) || streamTags.length >= 10}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={isCameraOn ? stopCamera : startCamera}
                    variant="outline"
                    className={`flex-1 ${isCameraOn ? 'border-green-500 text-green-400' : 'border-gray-600'}`}
                  >
                    {isCameraOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                    {isCameraOn ? 'Camera On' : 'Test Camera'}
                  </Button>
                  
                  <Button
                    onClick={toggleMic}
                    variant="outline"
                    className={`${isMicOn ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </div>
                
                <Button
                  onClick={startStream}
                  disabled={!streamTitle.trim() || !isCameraOn}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Live Stream
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Live Stream Interface */}
      {isStreaming && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Stream */}
          <div className="xl:col-span-3">
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800">
              {/* Stream Controls */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{currentViewers.toLocaleString()}</span>
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
                      onClick={toggleCamera}
                      size="sm"
                      variant="outline"
                      className={`${isCameraOn ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
                    >
                      {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={stopStream}
                      size="sm"
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      <Square className="w-4 h-4 mr-1" />
                      End Stream
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Video Stream */}
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Stream Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-bold text-white mb-2">{streamTitle}</h3>
                    
                    {/* Tip Goal Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
                        <span>Tip Goal Progress</span>
                        <span>{currentTips.toFixed(3)} / {tipGoal} ETH</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(tipGoalProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
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
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold">
                          <Gift className="w-4 h-4 mr-1" />
                          Tip
                        </Button>
                        
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          <Crown className="w-4 h-4 mr-1" />
                          Private
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Chat & Stats */}
          <div className="xl:col-span-1">
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 h-full">
              <div className="p-4 border-b border-gray-800">
                <h3 className="font-bold text-white">Live Chat</h3>
              </div>
              
              <div className="h-96 overflow-y-auto p-4 space-y-2">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="text-sm">
                    <span className={`font-semibold ${msg.isVip ? 'text-yellow-400' : 'text-pink-400'}`}>
                      {msg.isVip && <Crown className="w-3 h-3 inline mr-1" />}
                      {msg.user}:
                    </span>
                    <span className="text-gray-300 ml-2">{msg.message}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-800">
                <input
                  type="text"
                  placeholder="Chat with your audience..."
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Camera Preview */}
      {isCameraOn && !isStreaming && (
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800">
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
    </div>
  )
} 