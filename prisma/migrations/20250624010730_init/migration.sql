-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "walletAddress" TEXT,
    "walletType" TEXT,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "ageVerified" BOOLEAN NOT NULL DEFAULT false,
    "dateOfBirth" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME,
    "displayName" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "website" TEXT
);

-- CreateTable
CREATE TABLE "performer_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'CAM_GIRLS',
    "tags" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDocs" TEXT NOT NULL,
    "privateShowRate" REAL NOT NULL DEFAULT 8.0,
    "isPrivateAvailable" BOOLEAN NOT NULL DEFAULT true,
    "totalEarnings" REAL NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalFollowers" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "photos" TEXT NOT NULL,
    "videos" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "performer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "streams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "performerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,
    "playbackId" TEXT NOT NULL,
    "rtmpIngestUrl" TEXT NOT NULL,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "privateRate" REAL,
    "currentViewers" INTEGER NOT NULL DEFAULT 0,
    "totalViewers" INTEGER NOT NULL DEFAULT 0,
    "totalTips" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "streams_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "message" TEXT,
    "transactionHash" TEXT,
    "blockchainNetwork" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tips_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tips_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "streams" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_messages_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "streams" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "private_shows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "ratePerMinute" REAL NOT NULL,
    "totalAmount" REAL,
    "duration" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    CONSTRAINT "private_shows_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "private_shows_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "streams" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activePerformers" INTEGER NOT NULL DEFAULT 0,
    "totalStreams" INTEGER NOT NULL DEFAULT 0,
    "totalViewers" INTEGER NOT NULL DEFAULT 0,
    "totalTips" REAL NOT NULL DEFAULT 0,
    "totalRevenue" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "performer_profiles_userId_key" ON "performer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "streams_streamKey_key" ON "streams"("streamKey");

-- CreateIndex
CREATE UNIQUE INDEX "streams_playbackId_key" ON "streams"("playbackId");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "follows"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_date_key" ON "analytics"("date");
