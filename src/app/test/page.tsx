'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CameraTest } from '@/components/CameraTest'
import { OnboardingFlow } from '@/components/OnboardingFlow'
import { ProfileSetup } from '@/components/ProfileSetup'

export default function TestPage() {
  const [currentTest, setCurrentTest] = useState<string>('overview')
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const tests = [
    { id: 'overview', name: 'Overview', description: 'App overview and status' },
    { id: 'camera', name: 'Camera Test', description: 'Test camera functionality' },
    { id: 'onboarding', name: 'Onboarding Flow', description: 'Test user onboarding' },
    { id: 'profile', name: 'Profile Setup', description: 'Test profile creation' },
    { id: 'api', name: 'API Tests', description: 'Test API endpoints' }
  ]

  const testAPI = async () => {
    const results: Record<string, boolean> = {}
    
    try {
      // Test user API endpoint
      const response = await fetch('/api/user?address=test123')
      results.userAPI = response.status === 404 // Should return 404 for non-existent user
      
      // Test performers API endpoint  
      const performersResponse = await fetch('/api/performers')
      results.performersAPI = performersResponse.ok
      
      // Test analytics API endpoint
      const analyticsResponse = await fetch('/api/analytics')
      results.analyticsAPI = analyticsResponse.ok
      
      setTestResults(results)
      
    } catch (error) {
      console.error('API test failed:', error)
      setTestResults({ ...results, error: false })
    }
  }

  const handleOnboardingComplete = (user: any) => {
    console.log('Onboarding completed with user:', user)
    setTestResults(prev => ({ ...prev, onboarding: true }))
  }

  const handleProfileComplete = (profileData: any) => {
    console.log('Profile setup completed:', profileData)
    setTestResults(prev => ({ ...prev, profile: true }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            HotCams Test Suite
          </h1>
          <p className="text-gray-400 mt-2">Comprehensive testing for all app features</p>
        </div>

        {/* Test Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tests.map((test) => (
            <Button
              key={test.id}
              onClick={() => setCurrentTest(test.id)}
              variant={currentTest === test.id ? "default" : "outline"}
              className={`${
                currentTest === test.id
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600'
                  : 'border-gray-700 hover:border-pink-500'
              }`}
            >
              {test.name}
              {testResults[test.id] !== undefined && (
                <span className={`ml-2 w-2 h-2 rounded-full ${
                  testResults[test.id] ? 'bg-green-400' : 'bg-red-400'
                }`} />
              )}
            </Button>
          ))}
        </div>

        {/* Test Content */}
        <div className="max-w-4xl mx-auto">
          {currentTest === 'overview' && (
            <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800">
              <h2 className="text-2xl font-bold mb-6">HotCams Platform Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-400">✅ Completed Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Age verification system (18+ only)</li>
                    <li>• Multi-chain wallet support (Ethereum & Solana)</li>
                    <li>• User onboarding flow</li>
                    <li>• Profile setup (Viewer/Performer)</li>
                    <li>• Real database with Prisma & SQLite</li>
                    <li>• Seeded with real media files</li>
                    <li>• Live streaming studio with camera access</li>
                    <li>• Professional adult entertainment UI</li>
                    <li>• Creator dashboard with analytics</li>
                    <li>• Stream browsing and discovery</li>
                    <li>• Tip system and private shows</li>
                    <li>• Real-time chat and interactions</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-400">🎯 Key Components</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <code>OnboardingFlow</code> - Wallet → Profile → Dashboard</li>
                    <li>• <code>ProfileSetup</code> - Multi-step profile creation</li>
                    <li>• <code>StreamingStudio</code> - Live streaming interface</li>
                    <li>• <code>LivePlayer</code> - HLS video player</li>
                    <li>• <code>AgeVerification</code> - 18+ compliance</li>
                    <li>• <code>WalletProvider</code> - Multi-chain support</li>
                    <li>• <code>UserContext</code> - State management</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg">
                <h4 className="font-semibold mb-2">🚀 Ready to Use</h4>
                <p className="text-sm text-gray-300">
                  The platform is fully functional with real database, media files, and streaming capabilities. 
                  Users can connect wallets, set up profiles, and start streaming immediately.
                </p>
              </div>
            </Card>
          )}

          {currentTest === 'camera' && (
            <div className="space-y-6">
              <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800">
                <h2 className="text-2xl font-bold mb-4">Camera Functionality Test</h2>
                <p className="text-gray-400 mb-6">
                  Test camera access and video streaming. Make sure to allow camera permissions when prompted.
                </p>
              </Card>
              <CameraTest />
            </div>
          )}

          {currentTest === 'onboarding' && (
            <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800">
              <h2 className="text-2xl font-bold mb-4">Onboarding Flow Test</h2>
              <p className="text-gray-400 mb-6">
                Test the complete onboarding flow from wallet connection to dashboard access.
              </p>
              <OnboardingFlow onComplete={handleOnboardingComplete} />
            </Card>
          )}

          {currentTest === 'profile' && (
            <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800">
              <h2 className="text-2xl font-bold mb-4">Profile Setup Test</h2>
              <p className="text-gray-400 mb-6">
                Test the profile creation process for both viewers and performers.
              </p>
              <ProfileSetup onComplete={handleProfileComplete} />
            </Card>
          )}

          {currentTest === 'api' && (
            <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800">
              <h2 className="text-2xl font-bold mb-4">API Endpoints Test</h2>
              <p className="text-gray-400 mb-6">
                Test all API endpoints to ensure they're working correctly.
              </p>
              
              <div className="space-y-4">
                <Button onClick={testAPI} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Run API Tests
                </Button>
                
                {Object.keys(testResults).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Test Results:</h3>
                    {Object.entries(testResults).map(([test, passed]) => (
                      <div key={test} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${passed ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="capitalize">{test.replace(/([A-Z])/g, ' $1')}: </span>
                        <span className={passed ? 'text-green-400' : 'text-red-400'}>
                          {passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>HotCams - Decentralized Adult Entertainment Platform</p>
          <p>Built with Next.js, TypeScript, Prisma, and Web3</p>
        </div>
      </div>
    </div>
  )
} 