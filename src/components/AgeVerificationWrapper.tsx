"use client"

import React, { useState, useEffect } from 'react'
import { AgeVerification } from './AgeVerification'

interface AgeVerificationWrapperProps {
  children: React.ReactNode
}

export function AgeVerificationWrapper({ children }: AgeVerificationWrapperProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already verified age in this session
    const ageVerified = sessionStorage.getItem('age_verified')
    if (ageVerified === 'true') {
      setIsVerified(true)
    }
    setIsLoading(false)
  }, [])

  const handleAgeVerified = () => {
    setIsVerified(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isVerified) {
    return <AgeVerification onVerified={handleAgeVerified} />
  }

  return <>{children}</>
} 