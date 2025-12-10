import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Client-side Supabase client (for client components)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server-side client (for server components, API routes, and server actions)
export async function createServerClient() {
  // Import cookies only when needed (server-side only)
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Re-export types for convenience
export type {
  Database,
  User,
  Listing,
  Image,
  Auction,
  Bid,
  Thread,
  Message,
  Boost,
  Transaction,
  Report,
  ListingWithImages,
  ListingWithUser,
  ListingWithAuction,
  ListingFull,
  AuctionWithBids,
  ThreadWithMessages,
  MessageWithSender,
} from './database.types';
