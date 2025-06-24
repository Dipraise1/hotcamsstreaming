"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Eye, Star, Play, Users, Crown, Zap, Filter, Search, Gift, Sparkles } from 'lucide-react'

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

export default function BrowsePage() {
  const [performers, setPerformers] = useState<Performer[]>([])
  const [filteredPerformers, setFilteredPerformers] = useState<Performer[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [showOnlyLive, setShowOnlyLive] = useState(false)
  const [loading, setLoading] = useState(true)

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
  }, [])

  useEffect(() => {
    filterAndSortPerformers()
  }, [performers, selectedCategory, searchTerm, sortBy, showOnlyLive])

  const fetchPerformers = async () => {
    try {
      const response = await fetch('/api/performers')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched performers data:', data)
      
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

  const filterAndSortPerformers = () => {
    if (!Array.isArray(performers)) return
    let filtered = [...performers]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.profile.category.toLowerCase() === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.profile.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.profile.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by live status
    if (showOnlyLive) {
      filtered = filtered.filter(p => p.stream?.isLive)
    }

    // Sort performers
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.profile.totalViews - a.profile.totalViews)
        break
      case 'rating':
        filtered.sort((a, b) => b.profile.rating - a.profile.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.followerCount - a.followerCount)
        break
      case 'price_low':
        filtered.sort((a, b) => a.profile.privateShowRate - b.profile.privateShowRate)
        break
      case 'price_high':
        filtered.sort((a, b) => b.profile.privateShowRate - a.profile.privateShowRate)
        break
    }

    setFilteredPerformers(filtered)
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const getCategoryCount = (categoryId: string) => {
    if (!Array.isArray(performers)) return 0
    if (categoryId === 'all') return performers.length
    return performers.filter(p => p.profile.category.toLowerCase() === categoryId).length
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-black via-red-950/30 to-pink-950/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm rounded-full border border-red-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-pink-400 mr-2" />
              <span className="text-sm font-medium text-pink-200">Discover Your Perfect Match</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Browse Models
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore thousands of beautiful performers from around the world
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, tags, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-pink-400" />
                Filters
              </h3>
              
              {/* Live Toggle */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showOnlyLive}
                    onChange={(e) => setShowOnlyLive(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${showOnlyLive ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showOnlyLive ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-white group-hover:text-pink-400 transition-colors">
                    🔴 Live Only
                  </span>
                </label>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Most Followed</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-white mb-4">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                        selectedCategory === category.id
                          ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg transform scale-105`
                          : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs opacity-75">
                          {getCategoryCount(category.id)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {Array.isArray(filteredPerformers) ? filteredPerformers.length : 0} Models
                  {selectedCategory !== 'all' && (
                    <span className="text-pink-400"> in {categories.find(c => c.id === selectedCategory)?.name}</span>
                  )}
                </h2>
                <p className="text-gray-400 mt-2">
                  {Array.isArray(filteredPerformers) ? filteredPerformers.filter(p => p.stream?.isLive).length : 0} currently live
                </p>
              </div>
            </div>

            {/* Performers Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-800 aspect-[3/4] rounded-2xl mb-4"></div>
                    <div className="h-4 bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(filteredPerformers) && filteredPerformers.map((performer) => (
                  <Card key={performer.id} className="group overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25 backdrop-blur-sm">
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
                      
                      {/* Bio */}
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {performer.bio}
                      </p>
                      
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
            
            {!loading && filteredPerformers.length === 0 && (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 opacity-50">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-3">No models found</h3>
                <p className="text-gray-400 text-lg mb-6">Try adjusting your filters or search terms</p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchTerm('')
                    setShowOnlyLive(false)
                  }}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-semibold px-8 py-3 rounded-full"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 