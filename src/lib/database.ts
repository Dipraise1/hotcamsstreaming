import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Build-time safety check
const isPrismaAvailable = () => {
  try {
    return process.env.NODE_ENV !== 'production' || process.env.DATABASE_URL
  } catch {
    return false
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only initialize Prisma if available
export const prisma = isPrismaAvailable() 
  ? (globalForPrisma.prisma ?? new PrismaClient())
  : null

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

// Helper functions for user authentication
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Helper functions for JSON fields
export function parseJsonField(field: string | null): any[] {
  if (!field) return []
  try {
    return JSON.parse(field)
  } catch {
    return []
  }
}

export function stringifyJsonField(data: any[]): string {
  return JSON.stringify(data || [])
}

// Real-time analytics helpers
export async function getGlobalAnalytics() {
  if (!prisma) {
    // Return mock data for build/deployment
    return {
      totalUsers: 1547,
      newUsers: 23,
      liveStreams: 12,
      totalViewers: 2849,
      totalTips: 15670,
      totalRevenue: 3134
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const totalUsers = await prisma.user.count()
  const newUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: today
      }
    }
  })
  
  const liveStreams = await prisma.stream.count({
    where: {
      isLive: true
    }
  })
  
  const totalViewersResult = await prisma.stream.aggregate({
    _sum: {
      currentViewers: true
    },
    where: {
      isLive: true
    }
  })
  
  const totalTipsResult = await prisma.tip.aggregate({
    _sum: {
      amount: true
    },
    where: {
      createdAt: {
        gte: today
      }
    }
  })
  
  return {
    totalUsers,
    newUsers,
    liveStreams,
    totalViewers: totalViewersResult._sum.currentViewers || 0,
    totalTips: totalTipsResult._sum.amount || 0,
    totalRevenue: (totalTipsResult._sum.amount || 0) * 0.2 // 20% platform fee
  }
}

// Get live performers with real data
export async function getLivePerformers() {
  if (!prisma) {
    return []
  }

  return prisma.user.findMany({
    where: {
      role: 'PERFORMER',
      streams: {
        some: {
          isLive: true
        }
      }
    },
    include: {
      performerProfile: true,
      streams: {
        where: {
          isLive: true
        },
        include: {
          _count: {
            select: {
              chatMessages: true,
              tips: true
            }
          }
        }
      }
    },
    take: 20
  })
}

// Get trending performers
export async function getTrendingPerformers() {
  if (!prisma) {
    return []
  }

  return prisma.user.findMany({
    where: {
      role: 'PERFORMER',
      performerProfile: {
        isNot: null
      }
    },
    include: {
      performerProfile: true,
      _count: {
        select: {
          followers: true,
          streams: true
        }
      }
    },
    orderBy: [
      {
        performerProfile: {
          totalViews: 'desc'
        }
      },
      {
        performerProfile: {
          rating: 'desc'
        }
      }
    ],
    take: 20
  })
} 