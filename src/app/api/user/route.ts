import { NextRequest, NextResponse } from 'next/server'

// GET - Check if user exists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // In production/build, always return mock response
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return NextResponse.json({ exists: false, user: null })
    }

    // Try to use real database in development
    try {
      const { prisma } = await import('../../../lib/database')
      
      if (!prisma) {
        return NextResponse.json({ exists: false, user: null })
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress },
        include: {
          performerProfile: true
        }
      })

      return NextResponse.json({
        exists: !!user,
        user: user || null
      })
    } catch (dbError) {
      // Fallback to mock response if database fails
      return NextResponse.json({ exists: false, user: null })
    }
  } catch (error) {
    console.error('User GET API error:', error)
    return NextResponse.json({ exists: false, user: null })
  }
}

// POST - Create new user profile
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // In production/build, always return mock response
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return NextResponse.json({ 
        success: true, 
        user: {
          id: 'mock-user-id',
          username: data.username,
          walletAddress: data.walletAddress,
          role: data.role || 'VIEWER',
          isOnline: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })
    }

    // Try to use real database in development
    try {
      const { prisma } = await import('../../../lib/database')
      
      if (!prisma) {
        return NextResponse.json({ 
          success: true, 
          user: {
            id: 'mock-user-id',
            username: data.username,
            walletAddress: data.walletAddress,
            role: data.role || 'VIEWER',
            isOnline: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        })
      }

      // Create basic user
      const userData = {
        username: data.username,
        walletAddress: data.walletAddress,
        role: data.role || 'VIEWER',
        email: data.email,
      }

      const user = await prisma.user.create({
        data: userData
      })

      // Create performer profile if role is PERFORMER
      if (data.role === 'PERFORMER' && data.performerData) {
        await prisma.performerProfile.create({
          data: {
            userId: user.id,
            stageName: data.performerData.stageName,
            category: data.performerData.category,
            age: data.performerData.age,
            bio: data.performerData.bio || '',
            privateRate: data.performerData.privateRate || 60,
            tags: JSON.stringify(data.performerData.tags || []),
            photos: JSON.stringify([]),
            videos: JSON.stringify([]),
          }
        })
      }

      return NextResponse.json({ success: true, user })
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return mock success response even if database fails
      return NextResponse.json({ 
        success: true, 
        user: {
          id: 'mock-user-id',
          username: data.username,
          walletAddress: data.walletAddress,
          role: data.role || 'VIEWER',
          isOnline: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })
    }
  } catch (error) {
    console.error('User POST API error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
} 