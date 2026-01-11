'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithGoogle, signInWithFacebook, getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already logged in, redirect to home
    async function checkAuth() {
      const { user } = await getCurrentUser()
      if (user) {
        router.push('/')
      }
    }
    checkAuth()

    // Check for error from callback
    const errorParam = searchParams.get('error')
    if (errorParam === 'auth_failed') {
      setError('Authentication failed. Please try again.')
    } else if (errorParam === 'no_user') {
      setError('Unable to get user information. Please try again.')
    }
  }, [router, searchParams])

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await signInWithGoogle()

    if (error) {
      setError(error.message || 'Failed to sign up with Google')
      setLoading(false)
    }
    // If successful, user will be redirected by Google OAuth
  }

  // Facebook OAuth - Requires Facebook app configuration
  const handleFacebookSignUp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await signInWithFacebook()

    if (error) {
      setError(error.message || 'Failed to sign up with Facebook')
      setLoading(false)
    }
    // If successful, user will be redirected by Facebook OAuth
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Account
            </h1>
            <p className="text-xl text-gray-600">
              ចុះឈ្មោះ
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Sign up to start buying and selling on SabaySell
            </p>
            <p className="text-sm text-gray-500">
              ចុះឈ្មោះដើម្បីចាប់ផ្តើមទិញ និងលក់នៅលើ SabaySell
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignUp}
              disabled={loading}
              variant="outline"
              className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Facebook OAuth - Requires Facebook app configuration in Supabase dashboard */}
            <Button
              onClick={handleFacebookSignUp}
              disabled={loading}
              className="w-full h-12 text-base font-medium bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => router.push('/auth/login')}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
