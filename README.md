# HotCams - Decentralized Adult Entertainment Platform

🔞 **18+ ADULTS ONLY** - Premium live streaming platform built on Web3 technology

## 🚀 Overview

HotCams is a fully functional, decentralized adult entertainment platform that combines cutting-edge Web3 technology with professional streaming capabilities. Built with Next.js, TypeScript, and blockchain integration, it offers a complete ecosystem for performers and viewers.

## ✨ Key Features

### 🔐 **Web3 Authentication**
- Multi-chain wallet support (Ethereum & Solana)
- MetaMask and Phantom wallet integration
- Secure wallet-based authentication
- No traditional passwords required

### 👤 **User Management**
- Complete onboarding flow: Wallet → Profile → Dashboard
- Dual account types: Viewers and Performers
- Age verification system (18+ enforcement)
- Profile customization with bio, location, and preferences

### 🎥 **Live Streaming**
- Real camera access with HD quality (up to 1080p)
- Professional streaming studio interface
- Stream setup with titles, categories, and tags
- RTMP integration for external streaming software (OBS, XSplit)
- Live viewer count and real-time chat

### 💰 **Crypto Economics**
- Multi-currency tipping system (ETH, SOL, USDC)
- Private show functionality with per-minute rates
- Real-time earnings tracking
- Comprehensive analytics dashboard

### 🎨 **Professional UI/UX**
- Dark, sensual theme with gradient effects
- Responsive design for all devices
- Glassmorphism effects and animations
- Adult entertainment industry standards

### 📊 **Analytics & Insights**
- Real-time performance metrics
- Earnings tracking and history
- Viewer engagement analytics
- Stream performance data

## 🛠 Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern styling with PostCSS
- **Lucide React** - Beautiful icons

### **Blockchain & Web3**
- **wagmi** - Ethereum wallet integration
- **Solana Web3.js** - Solana wallet support
- **MetaMask** & **Phantom** wallet adapters

### **Backend & Database**
- **Prisma** - Modern database ORM
- **SQLite** - Local database (production-ready)
- **Next.js API Routes** - Serverless backend

### **Streaming Technology**
- **WebRTC** - Real-time communication
- **MediaDevices API** - Camera and microphone access
- **HLS.js** - HTTP Live Streaming
- **Livepeer** integration ready

## 📁 Project Structure

```
hotcams-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── analytics/     # Analytics data
│   │   │   ├── performers/    # Performer management
│   │   │   └── user/          # User management
│   │   ├── browse/            # Model browsing page
│   │   ├── dashboard/         # Creator dashboard
│   │   ├── profile/           # User profiles
│   │   ├── test/              # Testing suite
│   │   └── watch/             # Live streaming viewer
│   ├── components/            # React components
│   │   ├── layout/            # Layout components
│   │   ├── tips/              # Tipping system
│   │   ├── ui/                # UI components
│   │   └── wallet/            # Wallet integration
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript definitions
├── prisma/                    # Database schema & migrations
├── public/                    # Static assets & media files
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with camera support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotcams-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage Guide

### For New Users

1. **Connect Wallet**: Choose MetaMask (Ethereum) or Phantom (Solana)
2. **Age Verification**: Confirm you are 18+ years old
3. **Profile Setup**: Complete the multi-step profile creation
4. **Choose Account Type**: Select Viewer or Performer
5. **Dashboard Access**: Access your personalized dashboard

### For Performers

1. **Profile Setup**: Complete performer profile with stage name, category, rates
2. **Content Upload**: Add photos and videos to your profile
3. **Go Live**: Access the streaming studio and start broadcasting
4. **Camera Setup**: Allow camera access and configure streaming settings
5. **Earn Tips**: Receive crypto tips from viewers in real-time

### For Viewers

1. **Browse Models**: Explore performers by category and preferences
2. **Watch Live**: Join live streams and interact with performers
3. **Send Tips**: Support performers with crypto tips
4. **Private Shows**: Request exclusive one-on-one sessions

## 🧪 Testing

### Test Suite
Access the comprehensive test suite at `/test` to verify:
- Camera functionality
- Onboarding flow
- Profile setup
- API endpoints
- Real-time features

### Manual Testing
1. **Camera Test**: Verify camera access and video streaming
2. **Wallet Connection**: Test both Ethereum and Solana wallets
3. **Profile Creation**: Complete the onboarding process
4. **Live Streaming**: Test the streaming studio functionality

## 🗄️ Database Schema

The platform uses a comprehensive database schema with:

- **Users**: Wallet addresses, profiles, authentication
- **PerformerProfiles**: Stage names, rates, media, earnings
- **Streams**: Live streaming data and analytics
- **Tips**: Crypto transaction records
- **Analytics**: Performance metrics and insights
- **ChatMessages**: Real-time chat functionality

## 🔧 API Endpoints

### User Management
- `GET /api/user?address={wallet}` - Get user by wallet address
- `POST /api/user` - Create new user profile

### Performers
- `GET /api/performers` - List all performers
- `GET /api/performers?category={cat}` - Filter by category
- `GET /api/performers?live=true` - Show only live performers

### Analytics
- `GET /api/analytics` - Get platform analytics
- Real-time metrics and performance data

## 🎨 Customization

### Styling
- Tailwind CSS configuration in `tailwind.config.js`
- Custom gradients and color schemes
- Responsive breakpoints and animations

### Components
- Modular component architecture
- Reusable UI components in `/components/ui/`
- Custom hooks and contexts

## 🔒 Security & Compliance

### Age Verification
- Mandatory 18+ age verification
- Date of birth validation
- Session-based age confirmation

### Privacy
- Wallet-based authentication (no email required)
- Secure data handling
- GDPR compliance ready

### Content Moderation
- Performer verification system
- Content upload guidelines
- Community standards enforcement

## 🌐 Deployment

### Production Deployment
1. **Environment Variables**: Set up production environment variables
2. **Database**: Configure production database (PostgreSQL recommended)
3. **Streaming**: Set up Livepeer or similar streaming service
4. **CDN**: Configure media file delivery
5. **SSL**: Ensure HTTPS for security

### Recommended Platforms
- **Vercel** - Seamless Next.js deployment
- **Railway** - Full-stack deployment
- **AWS** - Enterprise-grade infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This is an adult entertainment platform intended for users 18 years and older. Please ensure compliance with local laws and regulations regarding adult content in your jurisdiction.

## 🆘 Support

For technical support or questions:
- Check the `/test` page for debugging tools
- Review browser console for error messages
- Ensure camera permissions are granted
- Verify wallet connection status

---

**Built with ❤️ for the future of decentralized adult entertainment**
# hotcamsstreaming
