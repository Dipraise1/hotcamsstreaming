import { NextResponse } from 'next/server'
import { prisma, parseJsonField } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const live = searchParams.get('live')
    
    const whereClause: any = {
      role: 'PERFORMER',
      performerProfile: {
        isNot: null
      }
    }
    
    if (category && category !== 'all') {
      whereClause.performerProfile.category = category.toUpperCase()
    }
    
    if (live === 'true') {
      whereClause.streams = {
        some: {
          isLive: true
        }
      }
    }
    
    const performers = await prisma.user.findMany({
      where: whereClause,
      include: {
        performerProfile: true,
        streams: {
          where: {
            isLive: true
          },
          take: 1
        },
        _count: {
          select: {
            followers: true
          }
        }
      },
      orderBy: [
        {
          performerProfile: {
            totalViews: 'desc'
          }
        }
      ],
      take: 50
    })
    
    const formattedPerformers = performers.map(performer => ({
      id: performer.id,
      username: performer.username,
      displayName: performer.displayName,
      avatar: performer.avatar,
      bio: performer.bio,
      location: performer.location,
      isVerified: performer.isVerified,
      profile: performer.performerProfile ? {
        stageName: performer.performerProfile.stageName,
        age: performer.performerProfile.age,
        category: performer.performerProfile.category,
        tags: parseJsonField(performer.performerProfile.tags),
        languages: parseJsonField(performer.performerProfile.languages),
        photos: parseJsonField(performer.performerProfile.photos),
        videos: parseJsonField(performer.performerProfile.videos),
        privateShowRate: performer.performerProfile.privateShowRate,
        totalEarnings: performer.performerProfile.totalEarnings,
        totalViews: performer.performerProfile.totalViews,
        totalFollowers: performer.performerProfile.totalFollowers,
        rating: performer.performerProfile.rating,
        ratingCount: performer.performerProfile.ratingCount,
        isVerified: performer.performerProfile.isVerified
      } : null,
      stream: performer.streams[0] ? {
        id: performer.streams[0].id,
        title: performer.streams[0].title,
        isLive: performer.streams[0].isLive,
        currentViewers: performer.streams[0].currentViewers,
        playbackId: performer.streams[0].playbackId
      } : null,
      followerCount: performer._count.followers
    }))
    
    return NextResponse.json(formattedPerformers)
  } catch (error) {
    console.error('Error fetching performers:', error)
    return NextResponse.json({ error: 'Failed to fetch performers' }, { status: 500 })
  }
} 