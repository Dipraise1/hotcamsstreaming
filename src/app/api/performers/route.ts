import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const live = searchParams.get('live')
    
    // Mock data for deployment - replace with real database queries later
    const mockPerformers = [
      {
        id: "1",
        username: "sophia_rose",
        displayName: "Sophia Rose",
        avatar: "/IMG_9057.JPEG",
        bio: "Sweet and playful cam girl who loves to chat and have fun! Come join me for some intimate moments 💕",
        location: "Los Angeles, CA",
        isVerified: true,
        profile: {
          stageName: "Sophia Rose",
          age: 24,
          category: "CAM_GIRLS",
          tags: ["blonde", "petite", "interactive", "girlfriend-experience", "toys"],
          languages: ["English", "Spanish"],
          photos: ["/IMG_9057.JPEG", "/photo_2022-11-08 23.56.28.jpeg"],
          videos: ["/telegram-cloud-document-5-6073303203603022769.mp4"],
          privateShowRate: 6.5,
          totalEarnings: 45000,
          totalViews: 280000,
          totalFollowers: 3500,
          rating: 4.8,
          ratingCount: 324,
          isVerified: true
        },
        stream: {
          id: "stream_1",
          title: "Sophia's Sensual Evening Show 💕",
          isLive: true,
          currentViewers: 247,
          playbackId: "pb_sophia_123"
        },
        followerCount: 3500
      },
      {
        id: "2",
        username: "maya_wild",
        displayName: "Maya Wild",
        avatar: "/photo_2022-11-09 22.06.24.jpeg",
        bio: "Exotic beauty with a wild side! I love exploring fantasies and making your dreams come true ✨",
        location: "Miami, FL",
        isVerified: true,
        profile: {
          stageName: "Maya Wild",
          age: 26,
          category: "CAM_GIRLS",
          tags: ["brunette", "curvy", "fetish-friendly", "roleplay", "dancing"],
          languages: ["English", "French"],
          photos: ["/photo_2022-11-09 22.06.24.jpeg", "/IMG_9408.PNG"],
          videos: ["/IMG_9318.MP4", "/IMG_9352.MOV"],
          privateShowRate: 8.0,
          totalEarnings: 62000,
          totalViews: 350000,
          totalFollowers: 4200,
          rating: 4.9,
          ratingCount: 456,
          isVerified: true
        },
        stream: live === 'true' ? {
          id: "stream_2",
          title: "Maya's Wild Adventure 🔥",
          isLive: true,
          currentViewers: 189,
          playbackId: "pb_maya_456"
        } : null,
        followerCount: 4200
      }
    ]

    // Filter by category if specified
    let filteredPerformers = mockPerformers
    if (category && category !== 'all') {
      filteredPerformers = mockPerformers.filter(p => 
        p.profile.category === category.toUpperCase()
      )
    }

    // Filter by live status if specified
    if (live === 'true') {
      filteredPerformers = filteredPerformers.filter(p => p.stream?.isLive)
    }

    return NextResponse.json(filteredPerformers)
  } catch (error) {
    console.error('Error fetching performers:', error)
    return NextResponse.json({ error: 'Failed to fetch performers' }, { status: 500 })
  }
} 