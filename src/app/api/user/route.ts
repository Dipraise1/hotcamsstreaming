import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

// GET - Check if user exists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { ethAddress: address },
          { solAddress: address }
        ]
      },
      include: {
        performerProfile: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
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

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }

    // Check if wallet address already exists
    if (ethAddress || solAddress) {
      const existingWallet = await prisma.user.findFirst({
        where: {
          OR: [
            { ethAddress },
            { solAddress }
          ]
        }
      })

      if (existingWallet) {
        return NextResponse.json({ error: 'Wallet address already registered' }, { status: 409 })
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
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
        isProfileComplete: true,
        canStream: role === 'PERFORMER',
        streamingApproved: false,
        followerCount: 0,
        followingCount: 0,
        ...(role === 'PERFORMER' && performerProfile && {
          performerProfile: {
            create: {
              stageName: performerProfile.stageName,
              age: performerProfile.age,
              gender: performerProfile.gender,
              category: performerProfile.category,
              tags: JSON.stringify(performerProfile.tags || []),
              photos: JSON.stringify(performerProfile.photos || []),
              videos: JSON.stringify(performerProfile.videos || []),
              privateShowRate: performerProfile.privateShowRate,
              totalViews: 0,
              rating: 0,
              ratingCount: 0,
              totalEarnings: 0,
              isLive: false,
              isOnline: false,
              isAvailableForPrivate: true,
              schedule: JSON.stringify({}),
              preferences: JSON.stringify({})
            }
          }
        })
      },
      include: {
        performerProfile: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 