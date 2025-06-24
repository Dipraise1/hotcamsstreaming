import { NextRequest, NextResponse } from 'next/server'

// GET - Check if user exists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    // Mock response for deployment - always return user not found for now
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      username,
      displayName,
      email,
      bio,
      location,
      dateOfBirth,
      role,
      ethAddress,
      solAddress,
      performerProfile
    } = body

    // Mock successful user creation
    const mockUser = {
      id: `user_${Date.now()}`,
      username,
      displayName,
      email,
      bio,
      location,
      dateOfBirth: new Date(dateOfBirth),
      role,
      ethAddress,
      solAddress,
      isVerified: false,
      canStream: role === 'PERFORMER',
      streamingApproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      performerProfile: role === 'PERFORMER' && performerProfile ? {
        id: `profile_${Date.now()}`,
        stageName: performerProfile.stageName,
        age: performerProfile.age,
        gender: performerProfile.gender,
        category: performerProfile.category,
        tags: performerProfile.tags || [],
        photos: performerProfile.photos || [],
        videos: performerProfile.videos || [],
        privateShowRate: performerProfile.privateShowRate,
        totalViews: 0,
        rating: 0,
        ratingCount: 0,
        totalEarnings: 0,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      } : null
    }

    return NextResponse.json(mockUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 