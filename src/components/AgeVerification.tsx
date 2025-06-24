"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Calendar, Shield } from 'lucide-react'

interface AgeVerificationProps {
  onVerified: () => void
}

export function AgeVerification({ onVerified }: AgeVerificationProps) {
  const [birthDate, setBirthDate] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user has already verified age in this session
    const ageVerified = sessionStorage.getItem('age_verified')
    if (ageVerified === 'true') {
      onVerified()
    }
  }, [onVerified])

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

  const handleVerification = () => {
    if (!birthDate) {
      setError('Please enter your birth date')
      return
    }

    const age = calculateAge(birthDate)
    
    if (age < 18) {
      setError('You must be 18 or older to access this site')
      return
    }

    // Store verification in session storage
    sessionStorage.setItem('age_verified', 'true')
    onVerified()
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setBirthDate(date)
    setError('')
    
    if (date) {
      const age = calculateAge(date)
      setIsValid(age >= 18)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Age Verification Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This website contains adult content intended for users 18 years of age or older.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                ⚠️ WARNING: Adult Content
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                By continuing, you confirm that you are at least 18 years old and consent to viewing adult content.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Enter your birth date
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerification}
              disabled={!birthDate}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              I am 18+ and consent to view adult content
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = 'https://google.com'}
              className="w-full"
            >
              I am under 18 - Exit Site
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-2">
            <p>
              By entering this site, you acknowledge that you are of legal age and that you agree to our Terms of Service and Privacy Policy.
            </p>
            <p>
              This verification is required by law and helps protect minors from accessing adult content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 