// =====================================================
// Listing Query Functions
// Data fetching for listings (works in both client and server)
// =====================================================

import { createClient } from '@/lib/supabase'
import type {
  Listing,
  ListingFull,
  ListingWithImages,
  ListingWithBoost,
  ListingWithUser,
  ListingStatus,
  ListingType,
  ListingCondition
} from '@/lib/database.types'

export interface ListingFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  condition?: ListingCondition[]
  location?: string
  type?: ListingType
  status?: ListingStatus
  userId?: string
  search?: string
  shipping_free?: boolean
  shipping_paid?: boolean
  local_pickup?: boolean
}

export interface ListingSortOptions {
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'ending_soon'
  limit?: number
  offset?: number
}

/**
 * Get all listings with filters, sorting, and pagination
 * Now includes active boost information for featured listings
 */
export async function getListings(
  filters: ListingFilters = {},
  options: ListingSortOptions = {}
): Promise<{ data: ListingWithBoost[], count: number }> {
  const supabase = createClient()

  let query = supabase
    .from('listings')
    .select(`
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
      boosts!left (
        id,
        type,
        ends_at,
        status
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
    `, { count: 'exact' })

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    // Default to active listings only
    query = query.eq('status', 'active')
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.priceMin !== undefined) {
    query = query.gte('price', filters.priceMin)
  }

  if (filters.priceMax !== undefined) {
    query = query.lte('price', filters.priceMax)
  }

  if (filters.condition && filters.condition.length > 0) {
    query = query.in('condition', filters.condition)
  }

  if (filters.location) {
    query = query.eq('location', filters.location)
  }

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  if (filters.userId) {
    query = query.eq('user_id', filters.userId)
  }

  if (filters.shipping_free) {
    query = query.eq('shipping_free', true)
  }

  if (filters.shipping_paid) {
    query = query.eq('shipping_paid', true)
  }

  if (filters.local_pickup) {
    query = query.eq('local_pickup', true)
  }

  // Full-text search (using pg_trgm)
  if (filters.search) {
    query = query.or(`title_en.ilike.%${filters.search}%,title_km.ilike.%${filters.search}%,description_en.ilike.%${filters.search}%,description_km.ilike.%${filters.search}%`)
  }

  // Apply base sorting (will be overridden by boost sorting in post-processing)
  const { sortBy = 'newest', limit = 20, offset = 0 } = options

  switch (sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'popular':
      query = query.order('views', { ascending: false })
      break
    case 'ending_soon':
      // For auctions, join with auctions table and sort by ends_at
      // For now, just sort by created_at
      query = query.order('created_at', { ascending: false })
      break
  }

  // Fetch MORE than needed to account for boost sorting (we'll paginate after sorting)
  const fetchLimit = Math.max(limit * 3, 60) // Fetch 3x limit or 60, whichever is larger
  query = query.range(0, fetchLimit - 1)

  const { data: rawData, error, count } = await query

  if (error) {
    console.error('Error fetching listings:', error)
    throw new Error(`Failed to fetch listings: ${error.message}`)
  }

  if (!rawData || rawData.length === 0) {
    return { data: [], count: 0 }
  }

  // Process boost data and apply boost-based sorting
  const now = new Date()
  const processedData = (rawData as any[]).map((listing: any) => {
    // Extract active boost if exists
    const boosts = listing.boosts || []
    const activeBoost = boosts.find((boost: any) =>
      boost.status === 'active' &&
      new Date(boost.ends_at) > now
    )

    // Remove boosts array and add single active_boost
    const { boosts: _, ...listingWithoutBoosts } = listing
    return {
      ...listingWithoutBoosts,
      active_boost: activeBoost ? {
        id: activeBoost.id,
        type: activeBoost.type,
        ends_at: activeBoost.ends_at
      } : null
    }
  })

  // Sort with boost priority
  // Priority: 1. Featured boosts, 2. Category boosts, 3. Regular listings
  processedData.sort((a: any, b: any) => {
    // Boost type weights: featured = 2, top_category = 1, no boost = 0
    const getBoostWeight = (listing: any) => {
      if (!listing.active_boost) return 0
      if (listing.active_boost.type === 'featured') return 2
      if (listing.active_boost.type === 'top_category') return 1
      return 0
    }

    const aWeight = getBoostWeight(a)
    const bWeight = getBoostWeight(b)

    // If boost weights differ, sort by weight (higher first)
    if (aWeight !== bWeight) {
      return bWeight - aWeight
    }

    // If same boost level, apply user's selected sort
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'price_asc':
        return (a.price || 0) - (b.price || 0)
      case 'price_desc':
        return (b.price || 0) - (a.price || 0)
      case 'popular':
        return (b.views || 0) - (a.views || 0)
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  // Apply pagination after sorting
  const paginatedData = processedData.slice(offset, offset + limit)

  return {
    data: paginatedData as ListingWithBoost[],
    count: count || 0
  }
}

/**
 * Get a single listing by ID with all relations
 */
export async function getListing(id: string): Promise<ListingFull | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(`
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
        bio,
        location,
        rating,
        total_ratings,
        total_sales
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
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching listing:', error)
    return null
  }

  return data as any
}

/**
 * Get user's own listings
 */
export async function getUserListings(
  userId: string,
  status?: ListingStatus
): Promise<ListingWithImages[]> {
  const { data } = await getListings(
    { userId, status },
    { sortBy: 'newest', limit: 100 }
  )

  return data
}

/**
 * Get featured/boosted listings for homepage
 */
export async function getFeaturedListings(limit: number = 10): Promise<ListingWithImages[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      images (
        id,
        url,
        storage_path,
        display_order,
        is_primary
      ),
      boosts!inner (
        id,
        type,
        status
      )
    `)
    .eq('status', 'active')
    .eq('boosts.status', 'active')
    .order('boosts.created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured listings:', error)
    return []
  }

  return (data as any[]) || []
}

/**
 * Increment listing view count
 */
export async function incrementListingViews(listingId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('increment_listing_views', {
    listing_id: listingId
  })

  if (error) {
    console.error('Error incrementing views:', error)
  }
}

/**
 * Search listings with full-text search
 */
export async function searchListings(
  searchQuery: string,
  filters: ListingFilters = {},
  options: ListingSortOptions = {}
): Promise<{ data: ListingWithImages[], count: number }> {
  return getListings(
    { ...filters, search: searchQuery },
    options
  )
}

/**
 * Get similar listings (same category, exclude current listing)
 */
export async function getSimilarListings(
  listingId: string,
  category: string,
  limit: number = 4
): Promise<ListingWithImages[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      images (
        id,
        url,
        storage_path,
        display_order,
        is_primary
      )
    `)
    .eq('status', 'active')
    .eq('category', category)
    .neq('id', listingId)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching similar listings:', error)
    return []
  }

  return (data as any[]) || []
}

/**
 * Update a listing's status
 */
export async function updateListingStatus(
  listingId: string,
  status: 'draft' | 'active' | 'sold' | 'expired'
): Promise<{ error: any }> {
  const { createServerClient } = await import('@/lib/supabase')
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('listings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', listingId)

  return { error }
}
