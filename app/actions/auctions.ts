'use server'

// =====================================================
// Auction Server Actions
// Mutations for bidding and auction management
// =====================================================

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase'
import { checkAuctionStatus } from '@/lib/queries/auctions'
import type { BidInsert } from '@/lib/database.types'

export interface PlaceBidResult {
  success: boolean
  bidId?: string
  error?: string
  newCurrentPrice?: number
}

/**
 * Place a bid on an auction
 */
export async function placeBid(
  auctionId: string,
  amount: number
): Promise<PlaceBidResult> {
  try {
    // Get authenticated user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return { success: false, error: 'Invalid bid amount' }
    }

    // Get auction details
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select(`
        *,
        listing:listings (
          id,
          user_id
        )
      `)
      .eq('id', auctionId)
      .single()

    if (auctionError || !auction) {
      return { success: false, error: 'Auction not found' }
    }

    const auctionData = auction as any

    // Check if user is trying to bid on their own auction
    if (auctionData.listing.user_id === user.id) {
      return { success: false, error: 'Cannot bid on your own auction' }
    }

    // Check auction status
    const currentStatus = await checkAuctionStatus(auctionId)

    if (currentStatus !== 'active') {
      return {
        success: false,
        error: currentStatus === 'ended'
          ? 'Auction has ended'
          : 'Auction is not active yet'
      }
    }

    // Check if auction has ended
    const now = new Date()
    const endsAt = new Date(auctionData.ends_at)

    if (now >= endsAt) {
      return { success: false, error: 'Auction has ended' }
    }

    // Calculate minimum bid amount
    const currentPrice = auctionData.current_price || auctionData.start_price
    const minIncrement = auctionData.min_increment || 1.0
    const minimumBid = currentPrice + minIncrement

    // Validate bid amount meets minimum
    if (amount < minimumBid) {
      return {
        success: false,
        error: `Bid must be at least $${minimumBid.toFixed(2)}`
      }
    }

    // Start transaction-like operations
    // 1. Mark all previous bids as 'outbid' (except the new one)
    if (auctionData.leading_bidder_id) {
      const { error: updateBidsError } = await supabase
        .from('bids')
        .update({ status: 'outbid' })
        .eq('auction_id', auctionId)
        .eq('status', 'active')

      if (updateBidsError) {
        console.error('Error updating previous bids:', updateBidsError)
      }
    }

    // 2. Insert new bid
    const bidData: BidInsert = {
      auction_id: auctionId,
      user_id: user.id,
      amount: amount,
      status: 'active',
      is_autobid: false,
      max_autobid_amount: null
    }

    const { data: newBid, error: bidError } = await supabase
      .from('bids')
      .insert(bidData as any)
      .select()
      .single()

    if (bidError) {
      console.error('Error inserting bid:', bidError)
      return { success: false, error: 'Failed to place bid' }
    }

    // 3. Update auction with new current price and leading bidder
    const { error: updateAuctionError } = await supabase
      .from('auctions')
      .update({
        current_price: amount,
        leading_bidder_id: user.id,
        total_bids: auctionData.total_bids + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', auctionId)

    if (updateAuctionError) {
      console.error('Error updating auction:', updateAuctionError)
      return { success: false, error: 'Failed to update auction' }
    }

    // Revalidate paths
    revalidatePath(`/listings/${auctionData.listing.id}`)
    revalidatePath('/')

    return {
      success: true,
      bidId: (newBid as any).id,
      newCurrentPrice: amount
    }
  } catch (error) {
    console.error('Unexpected error placing bid:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Get minimum bid amount for an auction
 */
export async function getMinimumBid(auctionId: string): Promise<number | null> {
  try {
    const supabase = await createServerClient()

    const { data: auction, error } = await supabase
      .from('auctions')
      .select('current_price, start_price, min_increment')
      .eq('id', auctionId)
      .single()

    if (error || !auction) {
      console.error('Error fetching auction for minimum bid:', error)
      return null
    }

    const auctionData = auction as any
    const currentPrice = auctionData.current_price || auctionData.start_price
    const minIncrement = auctionData.min_increment || 1.0

    return currentPrice + minIncrement
  } catch (error) {
    console.error('Unexpected error getting minimum bid:', error)
    return null
  }
}

/**
 * Cancel an auction (seller only)
 */
export async function cancelAuction(auctionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get auction with listing ownership check
    const { data: auction, error: fetchError } = await supabase
      .from('auctions')
      .select(`
        *,
        listing:listings (
          user_id
        )
      `)
      .eq('id', auctionId)
      .single()

    if (fetchError || !auction) {
      return { success: false, error: 'Auction not found' }
    }

    const auctionData = auction as any

    // Check ownership
    if (auctionData.listing.user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Check if auction has bids
    if (auctionData.total_bids > 0) {
      return { success: false, error: 'Cannot cancel auction with existing bids' }
    }

    // Update auction status to cancelled
    const { error: updateError } = await supabase
      .from('auctions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', auctionId)

    if (updateError) {
      console.error('Error cancelling auction:', updateError)
      return { success: false, error: 'Failed to cancel auction' }
    }

    revalidatePath(`/listings/${auctionData.listing_id}`)
    revalidatePath('/my-listings')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error cancelling auction:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}
