import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return mock data for now to ensure deployment succeeds
    const mockData = {
      today: {
        totalViews: 15420,
        uniqueViewers: 8932,
        totalTips: 1247.50,
        newFollowers: 89,
        totalEarnings: 249.50
      },
      weekly: [
        { date: new Date(), totalViews: 15420, uniqueViewers: 8932, totalTips: 1247.50 },
        { date: new Date(Date.now() - 86400000), totalViews: 14230, uniqueViewers: 8123, totalTips: 1156.25 },
        { date: new Date(Date.now() - 172800000), totalViews: 13945, uniqueViewers: 7834, totalTips: 1089.75 },
      ],
      realTime: {
        liveStreams: 24,
        currentViewers: 1247,
        todayTips: 1247.50,
        todayRevenue: 249.50
      }
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
} 