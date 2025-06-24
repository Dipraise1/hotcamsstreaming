import { NextResponse } from 'next/server'

// Mock analytics data for deployment
const mockAnalytics = {
  overview: {
    totalUsers: 1547,
    newUsers: 23,
    liveStreams: 12,
    totalViewers: 2849,
    totalTips: 15670,
    totalRevenue: 3134
  },
  daily: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    views: Math.floor(Math.random() * 1000) + 500,
    tips: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 1000) + 200,
    newUsers: Math.floor(Math.random() * 50) + 10
  })).reverse(),
  topPerformers: [
    { name: 'StellaRose', earnings: 12450, views: 89234 },
    { name: 'LunaVixen', earnings: 11200, views: 76543 },
    { name: 'CherryBomb', earnings: 9875, views: 65432 },
    { name: 'AngelDream', earnings: 8760, views: 54321 },
    { name: 'RedVelvet', earnings: 7650, views: 43210 }
  ]
}

export async function GET() {
  try {
    // In production/build, always return mock data
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return NextResponse.json(mockAnalytics)
    }

    // Try to use real database in development
    try {
      const { getGlobalAnalytics } = await import('../../../lib/database')
      const overview = await getGlobalAnalytics()
      
      return NextResponse.json({
        overview,
        daily: mockAnalytics.daily,
        topPerformers: mockAnalytics.topPerformers
      })
    } catch (dbError) {
      // Fallback to mock data if database fails
      return NextResponse.json(mockAnalytics)
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(mockAnalytics)
  }
} 