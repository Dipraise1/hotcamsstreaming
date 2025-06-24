import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  
  // Create real performers using the actual media files
  const performerData = [
    {
      email: 'sophia@hotcams.com',
      username: 'sophia_rose',
      displayName: 'Sophia Rose',
      stageName: 'Sophia Rose',
      age: 24,
      gender: 'FEMALE',
      category: 'CAM_GIRLS',
      bio: 'Sweet and playful cam girl who loves to chat and have fun! Come join me for some intimate moments 💕',
      tags: JSON.stringify(['blonde', 'petite', 'interactive', 'girlfriend-experience', 'toys']),
      languages: JSON.stringify(['English', 'Spanish']),
      photos: JSON.stringify(['/IMG_9057.JPEG', '/photo_2022-11-08 23.56.28.jpeg']),
      videos: JSON.stringify(['/telegram-cloud-document-5-6073303203603022769.mp4']),
      privateShowRate: 6.5,
      location: 'Los Angeles, CA'
    },
    {
      email: 'maya@hotcams.com',
      username: 'maya_wild',
      displayName: 'Maya Wild',
      stageName: 'Maya Wild',
      age: 26,
      gender: 'FEMALE',
      category: 'CAM_GIRLS',
      bio: 'Exotic beauty with a wild side! I love exploring fantasies and making your dreams come true ✨',
      tags: JSON.stringify(['brunette', 'curvy', 'fetish-friendly', 'roleplay', 'dancing']),
      languages: JSON.stringify(['English', 'French']),
      photos: JSON.stringify(['/photo_2022-11-09 22.06.24.jpeg', '/IMG_9408.PNG']),
      videos: JSON.stringify(['/IMG_9318.MP4', '/IMG_9352.MOV']),
      privateShowRate: 8.0,
      location: 'Miami, FL'
    },
    {
      email: 'alex@hotcams.com',
      username: 'alex_steel',
      displayName: 'Alex Steel',
      stageName: 'Alex Steel',
      age: 28,
      gender: 'MALE',
      category: 'CAM_BOYS',
      bio: 'Muscular and confident guy ready to show you a good time. Athletic build, great personality! 💪',
      tags: JSON.stringify(['muscular', 'athletic', 'confident', 'interactive', 'fitness']),
      languages: JSON.stringify(['English']),
      photos: JSON.stringify(['/IMG_9057.JPEG']),
      videos: JSON.stringify(['/IMG_9424.MOV', '/IMG_9436-2.MOV']),
      privateShowRate: 7.5,
      location: 'New York, NY'
    },
    {
      email: 'couple@hotcams.com',
      username: 'hot_couple_23',
      displayName: 'Hot Couple',
      stageName: 'Emma & Jake',
      age: 25,
      gender: 'COUPLE',
      category: 'COUPLES',
      bio: 'Real couple sharing intimate moments! We love performing together and exploring new experiences 🔥',
      tags: JSON.stringify(['couple', 'real-sex', 'interactive', 'passionate', 'young']),
      languages: JSON.stringify(['English']),
      photos: JSON.stringify(['/photo_2022-11-08 23.56.28.jpeg']),
      videos: JSON.stringify(['/telegram-cloud-document-4-5810047156039454056.mp4']),
      privateShowRate: 12.0,
      location: 'Austin, TX'
    },
    {
      email: 'luna@hotcams.com',
      username: 'luna_trans',
      displayName: 'Luna Goddess',
      stageName: 'Luna Goddess',
      age: 23,
      gender: 'TRANS',
      category: 'TRANS',
      bio: 'Beautiful trans goddess here to fulfill your fantasies! Sweet, sexy, and always ready to play 💋',
      tags: JSON.stringify(['trans', 'goddess', 'feminine', 'interactive', 'sweet']),
      languages: JSON.stringify(['English', 'Portuguese']),
      photos: JSON.stringify(['/photo_2022-11-09 22.06.24.jpeg']),
      videos: JSON.stringify(['/telegram-cloud-document-5-6118428449297138863.mp4']),
      privateShowRate: 9.0,
      location: 'San Francisco, CA'
    },
    {
      email: 'victoria@hotcams.com',
      username: 'victoria_mature',
      displayName: 'Victoria Mature',
      stageName: 'Victoria',
      age: 42,
      gender: 'FEMALE',
      category: 'MATURE',
      bio: 'Experienced MILF who knows exactly what you need! Classy, sophisticated, and incredibly sexy 🍷',
      tags: JSON.stringify(['milf', 'experienced', 'classy', 'sophisticated', 'roleplay']),
      languages: JSON.stringify(['English', 'Italian']),
      photos: JSON.stringify(['/IMG_9408.PNG']),
      videos: JSON.stringify(['/telegram-cloud-document-5-6073303203603022769 (1).mp4']),
      privateShowRate: 10.0,
      location: 'Las Vegas, NV'
    }
  ]
  
  // Create performers with profiles
  const createdPerformers = []
  for (const performer of performerData) {
    const user = await prisma.user.create({
      data: {
        email: performer.email,
        username: performer.username,
        displayName: performer.displayName,
        role: 'PERFORMER',
        isVerified: true,
        dateOfBirth: new Date(2000 - performer.age, 0, 1),
        bio: performer.bio,
        location: performer.location,
        avatar: JSON.parse(performer.photos)[0],
        canStream: true,
        streamingApproved: true,
        performerProfile: {
          create: {
            stageName: performer.stageName,
            age: performer.age,
            gender: performer.gender as any,
            category: performer.category as any,
            tags: performer.tags,
            languages: performer.languages,
            isVerified: true,
            verificationDocs: JSON.stringify(['verified.pdf']),
            privateShowRate: performer.privateShowRate,
            photos: performer.photos,
            videos: performer.videos,
            totalEarnings: Math.random() * 50000 + 10000,
            totalViews: Math.floor(Math.random() * 500000) + 50000,
            rating: 4.2 + Math.random() * 0.8,
            ratingCount: Math.floor(Math.random() * 500) + 100
          }
        }
      }
    })
    createdPerformers.push(user)
    
    // Create live streams for some performers
    if (Math.random() > 0.4) {
      const streamKey = `live_${user.username}_${Date.now()}`
      const playbackId = `pb_${Math.random().toString(36).substring(7)}`
      
      await prisma.stream.create({
        data: {
          userId: user.id,
          title: `${performer.stageName} Live Show 🔥`,
          description: `Come chat and have fun with ${performer.stageName}! Tips welcome 💕`,
          category: performer.category as any,
          tags: performer.tags,
          streamKey,
          playbackId,
          rtmpUrl: `rtmp://rtmp.livepeer.com/live/${streamKey}`,
          isLive: true,
          currentViewers: Math.floor(Math.random() * 500) + 50,
          totalViews: Math.floor(Math.random() * 2000) + 200,
          totalTips: Math.random() * 1000 + 100,
          startedAt: new Date(Date.now() - Math.random() * 3600000)
        }
      })
    }
  }
  
  // Create some regular users (viewers)
  const viewerData = [
    { email: 'john@example.com', username: 'john_viewer', displayName: 'John' },
    { email: 'mike@example.com', username: 'mike_fan', displayName: 'Mike' },
    { email: 'david@example.com', username: 'david_user', displayName: 'David' },
    { email: 'chris@example.com', username: 'chris_vip', displayName: 'Chris' },
    { email: 'alex@example.com', username: 'alex_viewer', displayName: 'Alex' }
  ]
  
  const createdViewers = []
  for (const viewerInfo of viewerData) {
    const viewer = await prisma.user.create({
      data: {
        email: viewerInfo.email,
        username: viewerInfo.username,
        displayName: viewerInfo.displayName,
        role: 'VIEWER',
        dateOfBirth: new Date(1990, 0, 1)
      }
    })
    createdViewers.push(viewer)
  }
  
  // Create some follows, tips, and chat messages for realism
  const liveStreams = await prisma.stream.findMany({ where: { isLive: true } })
  
  // Create follows
  for (const viewer of createdViewers) {
    const followCount = Math.floor(Math.random() * 3) + 1
    const shuffledPerformers = createdPerformers.sort(() => 0.5 - Math.random())
    
    for (let i = 0; i < followCount; i++) {
      await prisma.follow.create({
        data: {
          followerId: viewer.id,
          followingId: shuffledPerformers[i].id
        }
      })
    }
  }
  
  // Create tips
  for (const stream of liveStreams) {
    const tipCount = Math.floor(Math.random() * 5) + 2
    
    for (let i = 0; i < tipCount; i++) {
      const randomViewer = createdViewers[Math.floor(Math.random() * createdViewers.length)]
      
      await prisma.tip.create({
        data: {
          fromUserId: randomViewer.id,
          streamId: stream.id,
          amount: Math.random() * 50 + 5,
          currency: 'ETH',
          message: getRandomTipMessage(),
          txHash: `0x${Math.random().toString(16).substring(2, 66)}`
        }
      })
    }
  }
  
  // Create chat messages
  for (const stream of liveStreams) {
    const messageCount = Math.floor(Math.random() * 20) + 10
    
    for (let i = 0; i < messageCount; i++) {
      const randomViewer = createdViewers[Math.floor(Math.random() * createdViewers.length)]
      
      await prisma.chatMessage.create({
        data: {
          userId: randomViewer.id,
          streamId: stream.id,
          message: getRandomChatMessage(),
          isVip: Math.random() > 0.8
        }
      })
    }
  }
  
  // Create analytics data for the last 7 days
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    for (const performer of createdPerformers) {
      await prisma.analytics.create({
        data: {
          userId: performer.id,
          date,
                      totalViews: Math.floor(Math.random() * 1000) + 100,
            uniqueViewers: Math.floor(Math.random() * 500) + 50,
            totalTips: Math.random() * 200 + 20,
            newFollowers: Math.floor(Math.random() * 20) + 1
        }
      })
    }
  }
  
  console.log('✅ Database seeding completed!')
  console.log(`Created ${createdPerformers.length} performers`)
  console.log(`Created ${createdViewers.length} viewers`)
  console.log(`Created ${liveStreams.length} live streams`)
}

function getRandomChatMessage(): string {
  const messages = [
    "Hey gorgeous! 😍",
    "You look amazing today! ✨",
    "Can you do a little dance? 💃",
    "Love your outfit! 🔥",
    "You're so beautiful! 💕",
    "Having a great time here! 🎉",
    "Your smile is perfect! 😊",
    "Thanks for the show! 🙏",
    "You're incredible! ⭐",
    "Best performer on the site! 👑",
    "Can't wait for private show! 💋",
    "You made my day! ☀️",
    "So talented and beautiful! 🌟",
    "Love chatting with you! 💬",
    "You're amazing! Keep it up! 💪"
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

function getRandomTipMessage(): string {
  const messages = [
    "Keep being amazing! 💕",
    "You deserve this and more! ⭐",
    "Thanks for the great show! 🎉",
    "You're incredible! 🔥",
    "Love your energy! ✨",
    "For being so beautiful! 😍",
    "Keep up the great work! 💪",
    "You made my day! ☀️",
    "Thanks for being you! 💋",
    "You're the best! 👑"
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 