'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { OnboardingFlow } from '@/components/OnboardingFlow'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Eye, Star, Play, Users, Crown, Zap, Sparkles, Lock, Camera, Gift } from 'lucide-react'

interface Performer {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  location: string
  isVerified: boolean
  profile: {
    stageName: string
    age: number
    category: string
    tags: string[]
    languages: string[]
    photos: string[]
    videos: string[]
    privateShowRate: number
    totalViews: number
    rating: number
    ratingCount: number
    isVerified: boolean
  }
  stream: {
    id: string
    title: string
    isLive: boolean
    currentViewers: number
    playbackId: string
  } | null
  followerCount: number
}

interface Analytics {
  today: {
    totalUsers: number
    activePerformers: number
    totalViewers: number
    totalTips: number
  }
  realTime: {
    liveStreams: number
    currentViewers: number
    todayTips: number
  }
}

export default function HomePage() {
  const { user, isConnected, isProfileSetupComplete, isLoading: userLoading } = useUser()
  const [performers, setPerformers] = useState<Performer[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const categories = [
    { id: 'all', name: 'All Models', icon: '🔥', gradient: 'from-red-500 to-pink-500' },
    { id: 'cam_girls', name: 'Cam Girls', icon: '💋', gradient: 'from-pink-500 to-rose-500' },
    { id: 'couples', name: 'Couples', icon: '💕', gradient: 'from-purple-500 to-pink-500' },
    { id: 'cam_boys', name: 'Cam Boys', icon: '💪', gradient: 'from-blue-500 to-purple-500' },
    { id: 'trans', name: 'Trans', icon: '🌈', gradient: 'from-indigo-500 to-purple-500' },
    { id: 'mature', name: 'Mature', icon: '🍷', gradient: 'from-amber-500 to-red-500' },
    { id: 'fetish_bdsm', name: 'Fetish & BDSM', icon: '⛓️', gradient: 'from-gray-700 to-red-600' }
  ]

  useEffect(() => {
    fetchPerformers()
    fetchAnalytics()
    
    // Update analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [selectedCategory])

  useEffect(() => {
    // Show onboarding if wallet is connected but profile is not complete
    if (isConnected && !isProfileSetupComplete && !userLoading) {
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }
  }, [isConnected, isProfileSetupComplete, userLoading])

  const fetchPerformers = async () => {
    try {
      const response = await fetch(`/api/performers?category=${selectedCategory}&live=true`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched performers:', data)
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPerformers(data)
      } else {
        console.error('Performers data is not an array:', data)
        setPerformers([])
      }
    } catch (error) {
      console.error('Error fetching performers:', error)
      setPerformers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched analytics:', data)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Set default analytics data if fetch fails
      setAnalytics({
        today: {
          totalUsers: 0,
          activePerformers: 0,
          totalViewers: 0,
          totalTips: 0
        },
        realTime: {
          liveStreams: 0,
          currentViewers: 0,
          todayTips: 0
        }
      })
    }
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const handleOnboardingComplete = (userData: any) => {
    setShowOnboarding(false)
    // Optionally redirect to dashboard or refresh user data
  }

  // Show onboarding flow if needed
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Age Verification Banner */}
      <div className="bg-gradient-to-r from-red-900 to-pink-900 border-b border-red-800/50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center text-sm">
            <Lock className="w-4 h-4 mr-2 text-red-300" />
            <span className="font-medium text-red-100">18+ ADULTS ONLY</span>
            <span className="mx-3 text-red-300">•</span>
            <span className="text-red-200">All performers are verified 18+ years old</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-red-950/20 to-pink-950/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm rounded-full border border-red-500/30 mb-8">
              <Sparkles className="w-5 h-5 text-pink-400 mr-2" />
              <span className="text-sm font-medium text-pink-200">Premium Adult Entertainment Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              HotCams
            </h1>
            
            <p className="text-2xl md:text-3xl font-light mb-4 text-gray-300">
              Live • Intimate • Exclusive
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Connect with the world's most beautiful performers in HD quality. 
              Private shows, live chat, and exclusive content await.
            </p>
          </div>
          
          {/* Live Stats */}
          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <div className="text-3xl font-bold text-red-400">{analytics.realTime?.liveStreams || 0}</div>
                <div className="text-sm text-red-200 uppercase tracking-wider">Live Shows</div>
              </div>
              <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/20">
                <div className="text-3xl font-bold text-pink-400">{analytics.realTime?.currentViewers?.toLocaleString() || '0'}</div>
                <div className="text-sm text-pink-200 uppercase tracking-wider">Viewers Online</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400">{analytics.today?.activePerformers || 0}</div>
                <div className="text-sm text-purple-200 uppercase tracking-wider">Active Models</div>
              </div>
              <div className="bg-gradient-to-br from-amber-900/40 to-red-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
                <div className="text-3xl font-bold text-amber-400">24/7</div>
                <div className="text-sm text-amber-200 uppercase tracking-wider">Available</div>
              </div>
            </div>
          )}
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full shadow-2xl shadow-red-500/25 transform hover:scale-105 transition-all">
              <Play className="w-5 h-5 mr-2" />
              Watch Live Shows
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white font-semibold px-8 py-4 rounded-full backdrop-blur-sm">
              <Camera className="w-5 h-5 mr-2" />
              Start Broadcasting
            </Button>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-gradient-to-r from-gray-900 to-black border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg shadow-red-500/25` 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                } px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Performers Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              🔴 Live Now
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-xl text-gray-300">{performers.length} gorgeous models online</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 aspect-[3/4] rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {performers.map((performer) => (
                <Card key={performer.id} className="group overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
                    {/* Main Image */}
                    <div className="relative w-full h-full">
                      {performer.profile.photos.length > 0 ? (
                        <Image
                          src={performer.profile.photos[0]}
                          alt={performer.profile.stageName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-900 to-red-900 flex items-center justify-center">
                          <span className="text-6xl opacity-50">👤</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {/* Live Indicator */}
                      {performer.stream?.isLive && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                          LIVE
                        </div>
                      )}
                      
                      {/* Verification Badge */}
                      {performer.profile.isVerified && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg">
                          <Crown className="w-4 h-4" />
                        </div>
                      )}
                      
                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        {performer.stream?.currentViewers && (
                          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                            <Eye className="w-4 h-4 mr-1 text-red-400" />
                            {performer.stream.currentViewers}
                          </div>
                        )}
                        
                        <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {performer.profile.rating.toFixed(1)}
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <Link href={`/watch/${performer.stream?.id || performer.id}`}>
                            <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all">
                              <Play className="w-5 h-5 mr-2" />
                              {performer.stream?.isLive ? 'Watch Live' : 'View Profile'}
                            </Button>
                          </Link>
                          
                          {performer.profile.videos.length > 0 && (
                            <p className="text-pink-300 text-sm font-medium">
                              {performer.profile.videos.length} exclusive videos
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performer Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-xl text-white truncate">
                        {performer.profile.stageName}
                      </h3>
                      <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0">
                        {performer.profile.age}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <span className="mr-2">📍</span>
                      <span className="truncate">{performer.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-pink-400" />
                        <span>{formatViews(performer.profile.totalViews)} views</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-red-400" />
                        <span>{performer.followerCount}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {performer.profile.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300 hover:border-pink-500 hover:text-pink-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Private Show Rate */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="text-sm text-gray-400">
                        Private: <span className="font-bold text-pink-400">{performer.profile.privateShowRate} ETH/min</span>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold rounded-full">
                        <Gift className="w-4 h-4 mr-1" />
                        Tip
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && performers.length === 0 && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-50">😴</div>
              <h3 className="text-2xl font-bold text-white mb-3">No models online right now</h3>
              <p className="text-gray-400 text-lg">Check back later for more gorgeous performers!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose HotCams?</h2>
          <p className="text-xl text-gray-300 mb-16">The ultimate adult entertainment experience</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-black/50 p-8 rounded-2xl border border-gray-700 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🔒</div>
              <h3 className="text-2xl font-bold text-white mb-4">100% Secure & Private</h3>
              <p className="text-gray-300">Your privacy is our priority. Anonymous payments, encrypted connections, and complete discretion guaranteed.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-black/50 p-8 rounded-2xl border border-gray-700 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-4">HD Quality Streaming</h3>
              <p className="text-gray-300">Crystal clear 4K video, instant loading, and interactive features for the most immersive experience.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-black/50 p-8 rounded-2xl border border-gray-700 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">💎</div>
              <h3 className="text-2xl font-bold text-white mb-4">VIP Experience</h3>
              <p className="text-gray-300">Exclusive content, private shows, personalized interactions, and premium features for discerning members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-red-900 to-pink-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for the Ultimate Experience?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of satisfied members enjoying premium adult entertainment
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all">
              <Play className="w-5 h-5 mr-2" />
              Start Watching Now
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold px-8 py-4 rounded-full">
              <Crown className="w-5 h-5 mr-2" />
              Become VIP Member
            </Button>
          </div>
          
          <div className="mt-8 text-red-200 text-sm">
            <p>🔞 Must be 18+ to enter • All models are verified adults • Secure & Anonymous</p>
          </div>
        </div>
      </section>
    </div>
  )
}
