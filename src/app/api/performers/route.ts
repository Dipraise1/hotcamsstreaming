import { NextRequest, NextResponse } from 'next/server'

// Mock performers data for deployment
const mockPerformers = [
  {
    id: '1',
    username: 'stellarose',
    walletAddress: '0x1234567890123456789012345678901234567890',
    role: 'PERFORMER',
    isOnline: true,
    performerProfile: {
      stageName: 'Stella Rose',
      category: 'CAM_GIRLS',
      age: 24,
      location: 'California, USA',
      bio: 'Sweet and spicy 🌹 Come play with me!',
      tags: ['cute', 'interactive', 'dancing'],
      profilePhoto: '/IMG_9057.JPEG',
      coverPhoto: '/photo_2022-11-08 23.56.28.jpeg',
      videos: ['/IMG_9318.MP4', '/IMG_9352.MOV'],
      photos: ['/IMG_9408.PNG', '/photo_2022-11-09 22.06.24.jpeg'],
      totalViews: 145623,
      rating: 4.8,
      isLive: true,
      currentViewers: 234,
      tipGoal: 2000,
      currentTips: 1456,
      privateRate: 60,
      isVerified: true
    },
    _count: {
      followers: 3421
    }
  },
  {
    id: '2',
    username: 'lunavixen',
    walletAddress: '0x2345678901234567890123456789012345678901',
    role: 'PERFORMER',
    isOnline: true,
    performerProfile: {
      stageName: 'Luna Vixen',
      category: 'CAM_GIRLS',
      age: 26,
      location: 'Miami, FL',
      bio: 'Mysterious and seductive 🌙 Your midnight fantasy',
      tags: ['seductive', 'mysterious', 'fetish'],
      profilePhoto: '/photo_2022-11-08 23.56.28.jpeg',
      coverPhoto: '/IMG_9408.PNG',
      videos: ['/IMG_9424.MOV', '/telegram-cloud-document-4-5810047156039454056.mp4'],
      photos: ['/IMG_9057.JPEG', '/photo_2022-11-09 22.06.24.jpeg'],
      totalViews: 98765,
      rating: 4.9,
      isLive: true,
      currentViewers: 189,
      tipGoal: 1500,
      currentTips: 876,
      privateRate: 80,
      isVerified: true
    },
    _count: {
      followers: 2876
    }
  },
  {
    id: '3',
    username: 'cherrybomb',
    walletAddress: '0x3456789012345678901234567890123456789012',
    role: 'PERFORMER',
    isOnline: false,
    performerProfile: {
      stageName: 'Cherry Bomb',
      category: 'CAM_GIRLS',
      age: 22,
      location: 'Las Vegas, NV',
      bio: 'Explosive fun! 💥 Ready to blow your mind',
      tags: ['energetic', 'fun', 'wild'],
      profilePhoto: '/photo_2022-11-09 22.06.24.jpeg',
      coverPhoto: '/IMG_9057.JPEG',
      videos: ['/IMG_9436-2.MOV', '/telegram-cloud-document-5-6073303203603022769.mp4'],
      photos: ['/IMG_9408.PNG', '/photo_2022-11-08 23.56.28.jpeg'],
      totalViews: 76543,
      rating: 4.7,
      isLive: false,
      currentViewers: 0,
      tipGoal: 3000,
      currentTips: 0,
      privateRate: 70,
      isVerified: true
    },
    _count: {
      followers: 1987
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const live = searchParams.get('live')
    const search = searchParams.get('search')

    // In production/build, always return mock data
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      let filtered = [...mockPerformers]

      // Apply filters
      if (category && category !== 'ALL') {
        filtered = filtered.filter(p => 
          p.performerProfile?.category === category
        )
      }

      if (live === 'true') {
        filtered = filtered.filter(p => p.performerProfile?.isLive === true)
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(p =>
          p.performerProfile?.stageName?.toLowerCase().includes(searchLower) ||
          p.performerProfile?.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
          p.performerProfile?.location?.toLowerCase().includes(searchLower)
        )
      }

      return NextResponse.json(filtered)
    }

    // Try to use real database in development
    try {
      const { prisma } = await import('../../../lib/database')
      
      if (!prisma) {
        return NextResponse.json(mockPerformers)
      }

      let whereClause: any = {
        role: 'PERFORMER',
        performerProfile: {
          isNot: null
        }
      }

      if (category && category !== 'ALL') {
        whereClause.performerProfile = {
          ...whereClause.performerProfile,
          category: category
        }
      }

      if (live === 'true') {
        whereClause.performerProfile = {
          ...whereClause.performerProfile,
          isLive: true
        }
      }

      if (search) {
        const searchTerms = search.toLowerCase()
        whereClause.OR = [
          {
            performerProfile: {
              stageName: {
                contains: searchTerms,
                mode: 'insensitive'
              }
            }
          },
          {
            performerProfile: {
              location: {
                contains: searchTerms,
                mode: 'insensitive'
              }
            }
          }
        ]
      }

      const performers = await prisma.user.findMany({
        where: whereClause,
        include: {
          performerProfile: true,
          _count: {
            select: {
              followers: true
            }
          }
        },
        orderBy: [
          {
            performerProfile: {
              isLive: 'desc'
            }
          },
          {
            performerProfile: {
              currentViewers: 'desc'
            }
          }
        ]
      })

      return NextResponse.json(performers)
    } catch (dbError) {
      // Fallback to mock data if database fails
      return NextResponse.json(mockPerformers)
    }
  } catch (error) {
    console.error('Performers API error:', error)
    return NextResponse.json(mockPerformers)
  }
} 