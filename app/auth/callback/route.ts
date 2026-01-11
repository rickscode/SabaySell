import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // Handle OAuth errors (like flow_state_not_found)
  if (error) {
    console.error('OAuth callback error:', {
      error,
      error_code: requestUrl.searchParams.get('error_code'),
      error_description: requestUrl.searchParams.get('error_description'),
    })

    // If flow state not found, user might already be authenticated
    // Redirect to home instead of showing error
    if (error === 'server_error' && requestUrl.searchParams.get('error_code') === 'flow_state_not_found') {
      return NextResponse.redirect(new URL('/', requestUrl.origin))
    }

    // For other errors, redirect to login with error message
    return NextResponse.redirect(new URL(`/auth/login?error=${error}`, requestUrl.origin))
  }

  if (code) {
    const cookieStore = await import('next/headers').then(m => m.cookies())
    const cookies = await cookieStore

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookies.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    )

    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(new URL('/auth/login?error=auth_failed', requestUrl.origin))
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Error getting user:', userError)
      return NextResponse.redirect(new URL('/auth/login?error=no_user', requestUrl.origin))
    }

    // Wait a moment to ensure session is fully established
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check if user profile exists and is complete in public.users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, bio, location, telegram, whatsapp')
      .eq('id', user.id)
      .maybeSingle()

    // If no profile exists OR profile exists but incomplete (no bio/location/telegram/whatsapp), redirect to setup
    const prof = profile as any;
    if (profileError || !profile || (!prof.bio && !prof.location && !prof.telegram && !prof.whatsapp)) {
      return NextResponse.redirect(new URL('/auth/setup-profile', requestUrl.origin))
    }

    // Profile exists and is complete, redirect to home
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}
