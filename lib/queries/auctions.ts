// =====================================================
// Auction Query Functions
// Data fetching for auctions and bids
// =====================================================

import { createClient } from '@/lib/supabase'
import type {
  Auction,
  Bid,
  AuctionStatus
} from '@/lib/database.types'

export interface AuctionWithBids extends Auction {
  bids: Bid[]
  listing?: {
    id: string
    title_en: string | null
    title_km: string | null
    user_id: string
  }
  leading_bidder?: {
    id: string
    display_name: string | null
    avatar_url: string | null
  }
}

export interface BidWithUser extends Bid {
  user: {
    id: string
    display_name: string | null
    avatar_url: string | null
  }
}

/**
 * Get a single auction by ID with all related data
 */
export async function getAuction(auctionId: string): Promise<AuctionWithBids | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      listing:listings (
        id,
        title_en,
        title_km,
        user_id
      ),
      leading_bidder:users!auctions_leading_bidder_id_fkey (
        id,
        display_name,
        avatar_url
      ),
      bids (
        id,
        user_id,
        amount,
        status,
        is_autobid,
        max_autobid_amount,
        created_at,
        user:users (
          id,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('id', auctionId)
    .single()

  if (error) {
    console.error('Error fetching auction:', error)
    return null
  }

  return data as any
}

/**
 * Get auction by listing ID
 */
export async function getAuctionByListingId(listingId: string): Promise<AuctionWithBids | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      listing:listings (
        id,
        title_en,
        title_km,
        user_id
      ),
      leading_bidder:users!auctions_leading_bidder_id_fkey (
        id,
        display_name,
        avatar_url
      ),
      bids (
        id,
        user_id,
        amount,
        status,
        is_autobid,
        max_autobid_amount,
        created_at,
        user:users (
          id,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('listing_id', listingId)
    .single()

  if (error) {
    console.error('Error fetching auction by listing ID:', error)
    return null
  }

  return data as any
}

/**
 * Get bid history for an auction (most recent first)
 */
export async function getBidHistory(
  auctionId: string,
  limit: number = 20
): Promise<BidWithUser[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bids')
    .select(`
      *,
      user:users (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('auction_id', auctionId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching bid history:', error)
    return []
  }

  return (data as any[]) || []
}

/**
 * Get all active bids for a user
 */
export async function getUserActiveBids(userId: string): Promise<BidWithUser[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bids')
    .select(`
      *,
      user:users (
        id,
        display_name,
        avatar_url
      ),
      auction:auctions (
        id,
        listing_id,
        status,
        current_price,
        ends_at,
        listing:listings (
          id,
          title_en,
          title_km
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user active bids:', error)
    return []
  }

  return (data as any[]) || []
}

/**
 * Get the current leading bid for an auction
 */
export async function getLeadingBid(auctionId: string): Promise<BidWithUser | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bids')
    .select(`
      *,
      user:users (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('auction_id', auctionId)
    .eq('status', 'active')
    .order('amount', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching leading bid:', error)
    return null
  }

  return data as any
}

/**
 * Check if user is leading bidder on an auction
 */
export async function isUserLeadingBidder(
  auctionId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('auctions')
    .select('leading_bidder_id')
    .eq('id', auctionId)
    .single()

  if (error || !data) {
    return false
  }

  return (data as any).leading_bidder_id === userId
}

/**
 * Get auctions ending soon (within next 24 hours)
 */
export async function getAuctionsEndingSoon(limit: number = 10): Promise<AuctionWithBids[]> {
  const supabase = createClient()
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      listing:listings (
        id,
        title_en,
        title_km,
        user_id
      ),
      leading_bidder:users!auctions_leading_bidder_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'active')
    .lt('ends_at', tomorrow.toISOString())
    .gt('ends_at', now.toISOString())
    .order('ends_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching auctions ending soon:', error)
    return []
  }

  return (data as any[]) || []
}

/**
 * Check auction status and update if needed
 * Returns updated status
 */
export async function checkAuctionStatus(auctionId: string): Promise<AuctionStatus> {
  const supabase = createClient()
  const now = new Date()

  const { data: auction, error } = await supabase
    .from('auctions')
    .select('status, starts_at, ends_at')
    .eq('id', auctionId)
    .single()

  if (error || !auction) {
    console.error('Error checking auction status:', error)
    return 'ended'
  }

  const startsAt = new Date((auction as any).starts_at)
  const endsAt = new Date((auction as any).ends_at)
  const currentStatus = (auction as any).status as AuctionStatus

  // Determine correct status based on time
  let correctStatus: AuctionStatus = currentStatus

  if (now < startsAt) {
    correctStatus = 'upcoming'
  } else if (now >= startsAt && now < endsAt) {
    correctStatus = 'active'
  } else if (now >= endsAt) {
    correctStatus = 'ended'
  }

  // Update if status has changed
  if (correctStatus !== currentStatus) {
    const { error: updateError } = await supabase
      .from('auctions')
      .update({ status: correctStatus })
      .eq('id', auctionId)

    if (updateError) {
      console.error('Error updating auction status:', updateError)
    }
  }

  return correctStatus
}
