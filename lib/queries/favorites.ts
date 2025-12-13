// =====================================================
// Favorites Query Functions
// Data fetching for user favorites/watchlist
// =====================================================

import { createClient } from '@/lib/supabase'
import type {
  Favorite,
  FavoriteWithListing,
  ListingWithImages
} from '@/lib/database.types'

/**
 * Get all favorites for a user with full listing data
 * Used for displaying watchlist page
 */
export async function getUserFavorites(
  userId: string
): Promise<FavoriteWithListing[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      listing:listings!inner (
        *,
        images (
          id,
          url,
          storage_path,
          display_order,
          is_primary
        ),
        user:users (
          id,
          display_name,
          avatar_url,
          rating,
          total_ratings
        ),
        auction:auctions (
          id,
          status,
          start_price,
          current_price,
          min_increment,
          reserve_price,
          total_bids,
          leading_bidder_id,
          starts_at,
          ends_at
        )
      )
    `)
    .eq('user_id', userId)
    .eq('listing.status', 'active') // Only show active listings
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user favorites:', error)
    return []
  }

  return (data || []) as FavoriteWithListing[]
}

/**
 * Get array of listing IDs that user has favorited
 * Optimized for bulk checking (O(1) lookup with Set)
 */
export async function getFavoriteIdsForUser(
  userId: string
): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching favorite IDs:', error)
    return []
  }

  return (data || []).map(fav => fav.listing_id)
}

/**
 * Check if a specific listing is favorited by user
 * Used for single listing checks
 */
export async function checkIsFavorited(
  userId: string,
  listingId: string
): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .single()

  if (error) {
    // Not found is not an error for this query
    return false
  }

  return !!data
}

/**
 * Get total number of favorites for a listing
 * Used for analytics and listing detail pages
 */
export async function getFavoriteCount(
  listingId: string
): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('listing_id', listingId)

  if (error) {
    console.error('Error fetching favorite count:', error)
    return 0
  }

  return count || 0
}
