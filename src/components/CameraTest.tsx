'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Camera, CameraOff } from 'lucide-react'

export function CameraTest() {
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      console.log('Starting camera test...')

      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser')
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      })

      console.log('Camera stream obtained:', stream)

      // Set up video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true // Prevent feedback
        await videoRef.current.play()
        console.log('Video playing successfully')
      }

      streamRef.current = stream
      setIsActive(true)

    } catch (err: any) {
      console.error('Camera error:', err)
      
      let errorMessage = 'Camera access failed: '
      
      switch (err.name) {
        case 'NotAllowedError':
          errorMessage += 'Permission denied. Please allow camera access.'
          break
        case 'NotFoundError':
          errorMessage += 'No camera found.'
          break
        case 'NotReadableError':
          errorMessage += 'Camera is being used by another application.'
          break
        case 'OverconstrainedError':
          errorMessage += 'Camera settings not supported.'
          break
        default:
          errorMessage += err.message || 'Unknown error'
      }
      
      setError(errorMessage)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('Stopped track:', track.kind)
      })
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsActive(false)
    console.log('Camera stopped')
  }

  return (
    <Card className="p-6 bg-gray-900 border-gray-800">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Camera Test</h3>
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-gray-400">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p>Camera preview will appear here</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={isActive ? stopCamera : startCamera}
            className={`flex items-center gap-2 ${
              isActive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Start Camera
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>• Make sure your browser supports camera access</p>
          <p>• Allow camera permissions when prompted</p>
          <p>• Check browser console for detailed error messages</p>
        </div>
      </div>
    </Card>
  )
} 