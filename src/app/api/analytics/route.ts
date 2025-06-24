import { NextResponse } from 'next/server'
import { prisma, updateAnalytics } from '@/lib/database'

export async function GET() {
  try {
    // Update analytics first
    await updateAnalytics()
    
    // Get today's analytics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayAnalytics = await prisma.analytics.findUnique({
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
    
    return NextResponse.json({
      today: todayAnalytics,
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