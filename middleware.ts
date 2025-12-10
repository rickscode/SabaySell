import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/listings/new',
  '/listings/edit',
  '/messages',
  '/boosts',
  '/boost-payment',
]

// Define auth routes (redirect to home if already authenticated)
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/verify',
]

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  // Guard: if essential Supabase env vars are missing, don't try to instantiate the client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // In dev this often means the developer hasn't created a .env.local, so fail gracefully
    // and allow requests to continue (treat as unauthenticated). This avoids throwing
    // and causing the entire app to crash when env vars are absent.
    // Keep a server log so the developer knows what's missing.
    // NOTE: In production you should set these env vars in your deployment settings.
    console.warn('[middleware] Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  let session = null;
  try {
    const {
      data: { session: userSession },
    } = await supabase.auth.getSession()
    session = userSession;
  } catch (error) {
    // If Supabase is unreachable, treat user as unauthenticated
    console.error('[middleware] Failed to fetch session:', error);
    session = null;
  }

  const { pathname } = req.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to home if accessing auth routes with active session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return supabaseResponse
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
