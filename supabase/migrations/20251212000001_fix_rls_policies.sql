-- Fix RLS policies for bids and auctions tables
-- Strategy: Keep RLS simple, rely on application-layer validation for business logic

-- =====================================================
-- BIDS TABLE RLS POLICIES
-- =====================================================

-- Re-enable RLS on bids table
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can place bids on active auctions" ON bids;
DROP POLICY IF EXISTS "Bids are viewable for active auctions" ON bids;

-- Allow users to view bids they placed or bids on their auctions
CREATE POLICY "Users can view own bids and bids on their auctions"
  ON bids FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auctions a
      JOIN listings l ON l.id = a.listing_id
      WHERE a.id = bids.auction_id
      AND l.user_id = auth.uid()
    )
  );

-- Allow authenticated users to insert bids (validation done in application)
CREATE POLICY "Authenticated users can place bids"
  ON bids FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own bids (for status changes when outbid)
CREATE POLICY "Users can update own bids"
  ON bids FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- AUCTIONS TABLE RLS POLICIES
-- =====================================================

-- Re-enable RLS on auctions table
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Auctions are viewable by everyone" ON auctions;
DROP POLICY IF EXISTS "Users can create auctions for their listings" ON auctions;
DROP POLICY IF EXISTS "Users can update their own auctions" ON auctions;

-- Allow everyone to view active auctions
CREATE POLICY "Everyone can view auctions"
  ON auctions FOR SELECT
  USING (true);

-- Allow users to create auctions for their own listings
CREATE POLICY "Users can create auctions for own listings"
  ON auctions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND l.user_id = auth.uid()
    )
  );

-- Allow auction updates from:
-- 1. Listing owner (for cancellation, etc.)
-- 2. Any authenticated user (for bid-triggered updates like current_price, leading_bidder_id)
CREATE POLICY "Auctions can be updated by owner or for bids"
  ON auctions FOR UPDATE
  USING (
    -- Owner can update
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND l.user_id = auth.uid()
    )
    OR
    -- Any authenticated user can update for bidding
    -- (Application validates they're placing a valid bid)
    auth.uid() IS NOT NULL
  );

-- =====================================================
-- NOTES
-- =====================================================
-- Application-layer validation in app/actions/auctions.ts handles:
-- - Checking auction status is 'active'
-- - Preventing self-bidding (owner cannot bid)
-- - Validating bid amounts
-- - Updating previous bids to 'outbid' status
--
-- RLS policies are kept simple to avoid circular reference issues
-- and rely on the application code for business logic validation.
