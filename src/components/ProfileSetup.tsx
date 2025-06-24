'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Camera, Heart, Star, Shield, CheckCircle } from 'lucide-react'

interface ProfileSetupProps {
  onComplete: (profileData: any) => void
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    username: '',
    displayName: '',
    email: '',
    bio: '',
    location: '',
    dateOfBirth: '',
    role: 'VIEWER' as 'VIEWER' | 'PERFORMER',
    interestedInStreaming: false,
    // Performer specific fields
    stageName: '',
    age: '',
    gender: 'FEMALE' as 'FEMALE' | 'MALE' | 'COUPLE' | 'TRANS' | 'NON_BINARY',
    category: 'CAM_GIRLS' as string,
    privateShowRate: 50
  })

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about yourself',
      icon: User
    },
    {
      title: 'Account Type',
      description: 'Choose your experience',
      icon: Heart
    },
    {
      title: 'Performer Details',
      description: 'Set up your streaming profile',
      icon: Camera,
      condition: profileData.role === 'PERFORMER'
    },
    {
      title: 'Verification',
      description: 'Complete your profile',
      icon: Shield
    }
  ]

  const filteredSteps = steps.filter(step => !step.condition || step.condition)

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleNext = () => {
    if (currentStep < filteredSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate age
      const age = calculateAge(profileData.dateOfBirth)
      if (age < 18) {
        setError('You must be 18 or older to use this platform.')
        return
      }

      // Validate required fields
      if (!profileData.username.trim()) {
        setError('Username is required.')
        return
      }

      if (!profileData.dateOfBirth) {
        setError('Date of birth is required.')
        return
      }

      if (profileData.role === 'PERFORMER' && !profileData.stageName.trim()) {
        setError('Stage name is required for performers.')
        return
      }

      // Create profile data
      const finalProfileData = {
        username: profileData.username.trim(),
        displayName: profileData.displayName?.trim() || profileData.username.trim(),
        email: profileData.email?.trim() || null,
        bio: profileData.bio?.trim() || null,
        location: profileData.location?.trim() || null,
        dateOfBirth: profileData.dateOfBirth,
        role: profileData.role,
        ...(profileData.role === 'PERFORMER' && {
          performerProfile: {
            stageName: profileData.stageName.trim(),
            age: age,
            gender: profileData.gender,
            category: profileData.category,
            tags: [],
            photos: [],
            videos: [],
            privateShowRate: profileData.privateShowRate,
            totalViews: 0,
            rating: 0,
            ratingCount: 0,
            totalEarnings: 0
          }
        })
      }

      console.log('Creating profile:', finalProfileData)
      onComplete(finalProfileData)
    } catch (error: any) {
      console.error('Error creating profile:', error)
      setError(error.message || 'Failed to create profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to HotCams!</h2>
              <p className="text-gray-400">Let's set up your profile to get started</p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Choose a unique username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="How you want to be displayed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth * (Must be 18+)
                </label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Experience</h2>
              <p className="text-gray-400">How do you want to use HotCams?</p>
            </div>

            <div className="grid gap-4">
              <Card 
                className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                  profileData.role === 'VIEWER' 
                    ? 'border-pink-500 bg-pink-500/10' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onClick={() => handleInputChange('role', 'VIEWER')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Viewer</h3>
                    <p className="text-gray-400">Watch live shows, tip performers, and enjoy private sessions</p>
                  </div>
                  {profileData.role === 'VIEWER' && (
                    <CheckCircle className="w-6 h-6 text-pink-500" />
                  )}
                </div>
              </Card>

              <Card 
                className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                  profileData.role === 'PERFORMER' 
                    ? 'border-pink-500 bg-pink-500/10' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onClick={() => handleInputChange('role', 'PERFORMER')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Performer</h3>
                    <p className="text-gray-400">Stream live shows, earn crypto tips, and build your audience</p>
                  </div>
                  {profileData.role === 'PERFORMER' && (
                    <CheckCircle className="w-6 h-6 text-pink-500" />
                  )}
                </div>
              </Card>
            </div>

            {profileData.role === 'PERFORMER' && (
              <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg">
                <h4 className="text-white font-semibold mb-2">🎉 Performer Benefits</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Earn crypto tips in ETH, SOL, and USDC</li>
                  <li>• Set your own private show rates</li>
                  <li>• Build a loyal following</li>
                  <li>• Complete control over your content</li>
                  <li>• Instant crypto payouts</li>
                </ul>
              </div>
            )}
          </div>
        )

      case 3:
        if (profileData.role === 'PERFORMER') {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Performer Profile</h2>
                <p className="text-gray-400">Set up your streaming profile</p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stage Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.stageName}
                    onChange={(e) => handleInputChange('stageName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Your performer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="COUPLE">Couple</option>
                    <option value="TRANS">Trans</option>
                    <option value="NON_BINARY">Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={profileData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="CAM_GIRLS">Cam Girls</option>
                    <option value="CAM_BOYS">Cam Boys</option>
                    <option value="COUPLES">Couples</option>
                    <option value="TRANS">Trans</option>
                    <option value="MATURE">Mature</option>
                    <option value="FETISH">Fetish & BDSM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Private Show Rate (ETH per minute)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={profileData.privateShowRate}
                    onChange={(e) => handleInputChange('privateShowRate', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0.050"
                  />
                  <p className="text-xs text-gray-400 mt-1">Recommended: 0.01 - 0.1 ETH per minute</p>
                </div>
              </div>
            </div>
          )
        }
        // Fall through to verification step
        return renderVerificationStep()

      case filteredSteps.length:
        return renderVerificationStep()

      default:
        return null
    }
  }

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Almost Done!</h2>
        <p className="text-gray-400">Review your profile information</p>
      </div>

      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Username:</span>
            <span className="text-white">{profileData.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Account Type:</span>
            <span className="text-white">{profileData.role}</span>
          </div>
          {profileData.role === 'PERFORMER' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Stage Name:</span>
                <span className="text-white">{profileData.stageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-white">{profileData.category.replace('_', ' ')}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-lg">
        <h4 className="text-white font-semibold mb-2">🔒 Privacy & Security</h4>
        <p className="text-sm text-gray-300">
          Your profile is secured by blockchain technology. Only you control your data and earnings.
        </p>
      </div>
    </div>
  )

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.username && profileData.dateOfBirth && calculateAge(profileData.dateOfBirth) >= 18
      case 2:
        return profileData.role
      case 3:
        if (profileData.role === 'PERFORMER') {
          return profileData.stageName && profileData.gender && profileData.category
        }
        return true
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {filteredSteps.map((step, index) => {
              const StepIcon = step.icon
              const stepNumber = index + 1
              const isActive = currentStep === stepNumber
              const isCompleted = currentStep > stepNumber

              return (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted 
                      ? 'bg-green-500' 
                      : isActive 
                        ? 'bg-pink-500' 
                        : 'bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <StepIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-pink-500' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / filteredSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 bg-gray-900/80 backdrop-blur-sm border-gray-800">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="outline"
              className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
            >
              Back
            </Button>

            <div className="flex space-x-3">
              {currentStep < filteredSteps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8"
                >
                  {isLoading ? 'Creating Profile...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 