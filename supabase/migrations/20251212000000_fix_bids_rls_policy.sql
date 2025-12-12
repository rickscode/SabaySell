-- Fix RLS policy for bids table
-- The issue: The INSERT policy references bids.auction_id which doesn't work
-- during INSERT because the row doesn't exist yet in the table context

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can place bids on active auctions" ON bids;

-- Create new policy that properly checks auction status
-- Use NEW.auction_id instead of bids.auction_id for INSERT
CREATE POLICY "Users can place bids on active auctions"
  ON bids FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM auctions a
      JOIN listings l ON l.id = a.listing_id
      WHERE a.id = auction_id  -- This will reference the NEW row's auction_id
      AND a.status = 'active'
      AND l.user_id != auth.uid() -- Prevent self-bidding
    )
  );
