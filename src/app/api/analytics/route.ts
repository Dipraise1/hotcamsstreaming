import { NextResponse } from 'next/server'
import { prisma, getGlobalAnalytics } from '@/lib/database'

export async function GET() {
  try {
    // Get global analytics
    const globalStats = await getGlobalAnalytics()
    
    // Get today's analytics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayAnalytics = await prisma.analytics.findMany({
      where: { date: today }
    })
    
    // Get last 7 days for trends
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weeklyAnalytics = await prisma.analytics.findMany({
      where: {
        date: {
          gte: weekAgo
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    // Calculate real-time stats
    const liveStreams = await prisma.stream.count({
      where: { isLive: true }
    })
    
    const totalViewers = await prisma.stream.aggregate({
      _sum: {
        currentViewers: true
      },
      where: {
        isLive: true
      }
    })
    
    const todayTips = await prisma.tip.aggregate({
      _sum: {
        amount: true
      },
      where: {
        createdAt: {
          gte: today
        }
      }
    })
    
    // Aggregate today's analytics
    const todayAggregated = todayAnalytics.reduce((acc, curr) => ({
      totalViews: acc.totalViews + curr.totalViews,
      uniqueViewers: acc.uniqueViewers + curr.uniqueViewers,
      totalTips: acc.totalTips + curr.totalTips,
      newFollowers: acc.newFollowers + curr.newFollowers,
      totalEarnings: acc.totalEarnings + curr.totalEarnings
    }), {
      totalViews: 0,
      uniqueViewers: 0,
      totalTips: 0,
      newFollowers: 0,
      totalEarnings: 0
    })

    return NextResponse.json({
      today: todayAggregated,
      weekly: weeklyAnalytics,
      realTime: {
        liveStreams,
        currentViewers: totalViewers._sum.currentViewers || 0,
        todayTips: todayTips._sum.amount || 0,
        todayRevenue: (todayTips._sum.amount || 0) * 0.2
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
} 