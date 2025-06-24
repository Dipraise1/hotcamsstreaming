"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { WalletButtons } from '@/components/wallet/WalletButtons'
import { 
  Video, 
  Home, 
  User, 
  Settings, 
  Menu, 
  X, 
  Zap,
  Heart,
  Crown,
  Play,
  Search,
  Camera,
  Sparkles,
  Lock
  } from 'lucide-react'

export default function Navbar() {
  const { user, isConnected, isProfileSetupComplete, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                HotCams
              </span>
              <span className="text-xs text-gray-400 -mt-1">Premium Adult Entertainment</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-colors font-medium px-4 py-2 rounded-full hover:bg-gray-800/50"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              href="/browse" 
              className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-colors font-medium px-4 py-2 rounded-full hover:bg-gray-800/50"
            >
              <Play className="w-4 h-4" />
              <span>Browse Models</span>
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-colors font-medium px-4 py-2 rounded-full hover:bg-gray-800/50"
            >
              <Camera className="w-4 h-4" />
              <span>Go Live</span>
            </Link>
            
            {/* VIP Section */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-full border border-yellow-500/30 hover:border-yellow-400/50 transition-colors cursor-pointer group">
              <Crown className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-yellow-400 text-sm font-medium">VIP Access</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden xl:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gorgeous models..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Age Verification Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-red-900/30 rounded-full border border-red-700/50">
              <Lock className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">18+</span>
            </div>

            {/* User Section */}
            {isConnected && isProfileSetupComplete && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 hover:bg-gray-800/50 p-3 rounded-full"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden lg:block">{user.displayName || user.username}</span>
                </Button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{user.displayName || user.username}</div>
                          <div className="text-gray-400 text-sm">{user.role === 'PERFORMER' ? 'Performer' : 'Viewer'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-pink-400 hover:bg-gray-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link 
                        href="/dashboard" 
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-pink-400 hover:bg-gray-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Camera className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button 
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 w-full text-left"
                      >
                        <X className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:block">
                <WalletButtons />
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-300 hover:text-pink-400 p-3 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-800 py-6">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search models..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Mobile Links */}
              <Link 
                href="/" 
                className="flex items-center space-x-3 text-gray-300 hover:text-pink-400 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-gray-800/50"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                href="/browse" 
                className="flex items-center space-x-3 text-gray-300 hover:text-pink-400 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-gray-800/50"
                onClick={() => setIsOpen(false)}
              >
                <Play className="w-5 h-5" />
                <span>Browse Models</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-3 text-gray-300 hover:text-pink-400 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-gray-800/50"
                onClick={() => setIsOpen(false)}
              >
                <Camera className="w-5 h-5" />
                <span>Go Live</span>
              </Link>

              {/* Mobile Wallet */}
              <div className="pt-4 border-t border-gray-800">
                <WalletButtons />
              </div>

              {/* Mobile VIP */}
              <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">VIP Membership</span>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black font-semibold px-4 py-2">
                  Upgrade
                </Button>
              </div>

              {/* Mobile Age Verification */}
              <div className="flex items-center justify-center space-x-2 py-3 text-red-300 bg-red-900/20 rounded-lg border border-red-700/30">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">18+ Adults Only - All models verified</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 