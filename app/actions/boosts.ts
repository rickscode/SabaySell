'use server';

import { createServerClient } from '@/lib/supabase';
import { updateListingStatus } from '@/lib/queries/listings';
import {
  insertBoost,
  getBoostByPaymentReference,
  updateBoostStatus,
  getActiveBoostsByListing,
} from '@/lib/queries/boosts';
import type { BoostInsert } from '@/lib/database.types';

export type BoostType = 'featured' | 'top_category' | 'urgent' | 'highlight';

interface CreateBoostParams {
  listingId: string;
  boostTypes: BoostType[];
  durationDays: number;
}

interface CreateBoostResult {
  success: boolean;
  boostId?: string;
  paymentReference?: string;
  amount?: number;
  error?: string;
}

/**
 * Calculate boost pricing
 * TEST PRICES: $0.01 for category, $0.02 for homepage
 * PRODUCTION PRICES: Uncomment below when ready to deploy
 */
function calculateBoostPrice(boostTypes: BoostType[], durationDays: number): number {
  let basePrice = 0;

  // TEST PRICING (for development/testing)
  const prices = {
    featured: 0.02, // Featured on Homepage - TEST PRICE
    top_category: 0.01, // Featured in Category - TEST PRICE
    urgent: 0.01,
    highlight: 0.01,
  };

  // PRODUCTION PRICING (uncomment when deploying)
  // const prices = {
  //   featured: 15, // Featured on Homepage
  //   top_category: 5, // Featured in Category
  //   urgent: 3,
  //   highlight: 2,
  // };

  // Calculate base price for selected boosts
  boostTypes.forEach((type) => {
    basePrice += prices[type] || 0;
  });

  // Apply bundle discount if both featured and top_category (production only)
  // if (boostTypes.includes('featured') && boostTypes.includes('top_category')) {
  //   basePrice = 12; // Bundle discount (instead of $20)
  // }

  // For test pricing, no duration multiplier (keep it simple)
  // For production, uncomment below:
  // const durationMultiplier = durationDays / 7;
  // const totalPrice = basePrice * durationMultiplier;

  return Math.round(basePrice * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate unique payment reference ID
 */
function generatePaymentReference(listingId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BOOST-${listingId.substring(0, 8)}-${timestamp}-${random}`;
}

/**
 * Create a new boost for a listing
 */
export async function createBoost(params: CreateBoostParams): Promise<CreateBoostResult> {
  try {
    // Get user from server-side Supabase client
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error in createBoost:', authError);
      return { success: false, error: 'Not authenticated' };
    }

    const { listingId, boostTypes, durationDays } = params;

    if (!listingId || boostTypes.length === 0) {
      return { success: false, error: 'Missing required parameters' };
    }

    // Calculate total price
    const amount = calculateBoostPrice(boostTypes, durationDays);
    const paymentReference = generatePaymentReference(listingId);

    // For now, create one boost record for the primary type
    // In the future, you could create multiple boost records or have a JSON field
    const primaryBoostType = boostTypes.includes('featured') ? 'featured' : 'top_category';

    const boostData: BoostInsert = {
      listing_id: listingId,
      user_id: user.id,
      type: primaryBoostType,
      status: 'pending_payment',
      amount,
      currency: 'USD',
      payment_reference: paymentReference,
      payment_provider: 'KHQR',
      duration_hours: durationDays * 24,
    };

    const { data, error } = await insertBoost(boostData);

    if (error || !data) {
      console.error('Failed to create boost:', error);
      return { success: false, error: 'Failed to create boost' };
    }

    return {
      success: true,
      boostId: data.id,
      paymentReference,
      amount,
    };
  } catch (error) {
    console.error('Error creating boost:', error);
    return { success: false, error: 'An error occurred' };
  }
}

/**
 * Verify and activate a boost payment
 * This is called by the webhook or test button
 */
export async function verifyBoostPayment(paymentReference: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Find boost by payment reference
    const { data: boost, error: fetchError } = await getBoostByPaymentReference(paymentReference);

    if (fetchError || !boost) {
      return { success: false, error: 'Boost not found' };
    }

    if (boost.status === 'active') {
      return { success: false, error: 'Boost already active' };
    }

    // Calculate start and end times
    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + boost.duration_hours * 60 * 60 * 1000);

    // Update boost status to active
    const { error: updateError } = await updateBoostStatus(boost.id, {
      status: 'active',
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (updateError) {
      console.error('Failed to update boost status:', updateError);
      return { success: false, error: 'Failed to activate boost' };
    }

    // Update listing status to active (if it was draft)
    const { error: listingError } = await updateListingStatus(boost.listing_id, 'active');

    if (listingError) {
      console.error('Failed to update listing status:', listingError);
      // Don't fail the whole operation, just log it
    }

    return { success: true };
  } catch (error) {
    console.error('Error verifying boost payment:', error);
    return { success: false, error: 'An error occurred' };
  }
}

/**
 * Check if a listing has active boosts
 */
export async function checkActiveBoosts(
  listingId: string
): Promise<{ success: boolean; hasActiveBoosts: boolean; boosts?: any[]; error?: string }> {
  try {
    const { data: boosts, error } = await getActiveBoostsByListing(listingId);

    if (error) {
      console.error('Failed to check active boosts:', error);
      return { success: false, hasActiveBoosts: false, error: 'Failed to check boosts' };
    }

    return {
      success: true,
      hasActiveBoosts: (boosts?.length || 0) > 0,
      boosts: boosts || [],
    };
  } catch (error) {
    console.error('Error checking active boosts:', error);
    return { success: false, hasActiveBoosts: false, error: 'An error occurred' };
  }
}

/**
 * Get active boosts for multiple user listings (server action for client components)
 * This is needed because client components cannot call createServerClient() directly
 */
export async function getActiveBoostsForUserListings(
  listingIds: string[]
): Promise<{ success: boolean; boostsMap?: Record<string, Boost[]>; error?: string }> {
  try {
    // Fetch boosts for all listings in parallel
    const boostsResults = await Promise.all(
      listingIds.map(id => getActiveBoostsByListing(id))
    );

    // Create a map of listingId -> boosts (as plain object for JSON serialization)
    const boostsMap: Record<string, Boost[]> = {};
    listingIds.forEach((id, index) => {
      const { data: boosts } = boostsResults[index];
      if (boosts && boosts.length > 0) {
        boostsMap[id] = boosts;
      }
    });

    return { success: true, boostsMap };
  } catch (error) {
    console.error('Error fetching boosts for user listings:', error);
    return { success: false, error: 'Failed to fetch boosts' };
  }
}
