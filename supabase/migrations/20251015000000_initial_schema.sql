-- =====================================================
-- Sabay Sell Initial Database Schema
-- Phase 2: Database Schema & Authentication Setup
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For Khmer full-text search

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE listing_type AS ENUM ('fixed', 'auction');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'sold', 'expired', 'removed');
CREATE TYPE listing_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
CREATE TYPE auction_status AS ENUM ('upcoming', 'active', 'ended', 'cancelled');
CREATE TYPE bid_status AS ENUM ('active', 'outbid', 'won', 'lost');
CREATE TYPE boost_type AS ENUM ('featured', 'top_category', 'urgent', 'highlight');
CREATE TYPE boost_status AS ENUM ('pending_payment', 'pending_verification', 'active', 'expired', 'rejected');
CREATE TYPE transaction_type AS ENUM ('boost_payment', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');
CREATE TYPE report_reason AS ENUM ('spam', 'inappropriate', 'scam', 'duplicate', 'other');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INT DEFAULT 0,
  total_sales INT DEFAULT 0,
  total_purchases INT DEFAULT 0,
  is_banned BOOLEAN DEFAULT false,
  banned_reason TEXT,
  banned_until TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings Table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type listing_type NOT NULL DEFAULT 'fixed',
  status listing_status NOT NULL DEFAULT 'draft',

  -- Content (multilingual)
  title_en VARCHAR(200),
  title_km VARCHAR(200),
  description_en TEXT,
  description_km TEXT,

  -- Pricing
  price DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',

  -- Details
  category VARCHAR(50) NOT NULL,
  condition listing_condition,
  location VARCHAR(100),
  quantity INT DEFAULT 1,

  -- Metadata
  views INT DEFAULT 0,
  favorites INT DEFAULT 0,
  is_negotiable BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Images Table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auctions Table
CREATE TABLE auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  status auction_status NOT NULL DEFAULT 'upcoming',

  -- Pricing
  start_price DECIMAL(12,2) NOT NULL,
  current_price DECIMAL(12,2),
  min_increment DECIMAL(12,2) NOT NULL DEFAULT 1.00,
  reserve_price DECIMAL(12,2),

  -- Bidding
  total_bids INT DEFAULT 0,
  leading_bidder_id UUID REFERENCES users(id),

  -- Timing
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  extended_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(listing_id)
);

-- Bids Table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status bid_status NOT NULL DEFAULT 'active',
  is_autobid BOOLEAN DEFAULT false,
  max_autobid_amount DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent self-bidding (handled in RLS)
  CONSTRAINT check_positive_amount CHECK (amount > 0)
);

-- =====================================================
-- COMMUNICATION TABLES
-- =====================================================

-- Threads Table (Chat conversations)
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Status
  is_archived_by_buyer BOOLEAN DEFAULT false,
  is_archived_by_seller BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,

  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique conversation per listing between buyer and seller
  UNIQUE(listing_id, buyer_id, seller_id)
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,

  -- Read status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Attachments (future: image sharing)
  attachment_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_non_empty_body CHECK (LENGTH(TRIM(body)) > 0)
);

-- =====================================================
-- MONETIZATION TABLES
-- =====================================================

-- Boosts Table
CREATE TABLE boosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type boost_type NOT NULL,
  status boost_status NOT NULL DEFAULT 'pending_payment',

  -- Pricing
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Payment verification
  payment_reference VARCHAR(100),
  payment_screenshot_url TEXT,
  payment_provider VARCHAR(50) DEFAULT 'KHQR',

  -- Timing
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  duration_hours INT NOT NULL,

  -- Admin review
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boost_id UUID REFERENCES boosts(id),

  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',

  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Payment details
  provider VARCHAR(50),
  external_reference VARCHAR(200),

  -- Metadata
  notes TEXT,
  processed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MODERATION TABLES
-- =====================================================

-- Reports Table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Target (listing or user)
  target_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  reason report_reason NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'pending',

  -- Admin review
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  resolution_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Must report either a listing or user
  CONSTRAINT check_target CHECK (
    (target_listing_id IS NOT NULL AND target_user_id IS NULL) OR
    (target_listing_id IS NULL AND target_user_id IS NOT NULL)
  )
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Listings (critical for search and browse)
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_published_at ON listings(published_at DESC) WHERE status = 'active';
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_location ON listings(location);

-- Full-text search indexes for Khmer + English
CREATE INDEX idx_listings_title_en_trgm ON listings USING gin(title_en gin_trgm_ops);
CREATE INDEX idx_listings_title_km_trgm ON listings USING gin(title_km gin_trgm_ops);
CREATE INDEX idx_listings_description_en_trgm ON listings USING gin(description_en gin_trgm_ops);
CREATE INDEX idx_listings_description_km_trgm ON listings USING gin(description_km gin_trgm_ops);

-- Images
CREATE INDEX idx_images_listing_id ON images(listing_id);
CREATE INDEX idx_images_display_order ON images(listing_id, display_order);

-- Auctions
CREATE INDEX idx_auctions_listing_id ON auctions(listing_id);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_ends_at ON auctions(ends_at) WHERE status = 'active';
CREATE INDEX idx_auctions_leading_bidder ON auctions(leading_bidder_id);

-- Bids
CREATE INDEX idx_bids_auction_id ON bids(auction_id, created_at DESC);
CREATE INDEX idx_bids_user_id ON bids(user_id);
CREATE INDEX idx_bids_status ON bids(status);

-- Threads
CREATE INDEX idx_threads_buyer_id ON threads(buyer_id);
CREATE INDEX idx_threads_seller_id ON threads(seller_id);
CREATE INDEX idx_threads_listing_id ON threads(listing_id);
CREATE INDEX idx_threads_last_message ON threads(last_message_at DESC);

-- Messages
CREATE INDEX idx_messages_thread_id ON messages(thread_id, created_at ASC);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(thread_id) WHERE is_read = false;

-- Boosts
CREATE INDEX idx_boosts_listing_id ON boosts(listing_id);
CREATE INDEX idx_boosts_user_id ON boosts(user_id);
CREATE INDEX idx_boosts_status ON boosts(status);
CREATE INDEX idx_boosts_active ON boosts(starts_at, ends_at) WHERE status = 'active';

-- Transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_boost_id ON transactions(boost_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Reports
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_target_listing ON reports(target_listing_id);
CREATE INDEX idx_reports_target_user ON reports(target_user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS POLICIES
-- =====================================================

-- Users can read all public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- LISTINGS POLICIES
-- =====================================================

-- Anyone can view active listings
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT
  USING (status = 'active' OR user_id = auth.uid());

-- Users can create their own listings
CREATE POLICY "Users can create own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- IMAGES POLICIES
-- =====================================================

-- Anyone can view images of active listings
CREATE POLICY "Images are viewable by everyone"
  ON images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = images.listing_id
      AND (listings.status = 'active' OR listings.user_id = auth.uid())
    )
  );

-- Users can manage images for their own listings
CREATE POLICY "Users can manage images for own listings"
  ON images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = images.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- =====================================================
-- AUCTIONS POLICIES
-- =====================================================

-- Anyone can view auctions for active listings
CREATE POLICY "Auctions are viewable by everyone"
  ON auctions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = auctions.listing_id
      AND (listings.status = 'active' OR listings.user_id = auth.uid())
    )
  );

-- Users can create auctions for their own listings
CREATE POLICY "Users can create auctions for own listings"
  ON auctions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = auctions.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- Users can update auctions for their own listings
CREATE POLICY "Users can update auctions for own listings"
  ON auctions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = auctions.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- =====================================================
-- BIDS POLICIES
-- =====================================================

-- Users can view bids for active auctions
CREATE POLICY "Bids are viewable for active auctions"
  ON bids FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auctions a
      JOIN listings l ON l.id = a.listing_id
      WHERE a.id = bids.auction_id
      AND (a.status = 'active' OR l.user_id = auth.uid())
    )
  );

-- Users can place bids on active auctions
CREATE POLICY "Users can place bids on active auctions"
  ON bids FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM auctions a
      JOIN listings l ON l.id = a.listing_id
      WHERE a.id = bids.auction_id
      AND a.status = 'active'
      AND l.user_id != auth.uid() -- Prevent self-bidding
    )
  );

-- =====================================================
-- THREADS POLICIES
-- =====================================================

-- Users can view threads they're part of
CREATE POLICY "Users can view own threads"
  ON threads FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Users can create threads (as buyer)
CREATE POLICY "Users can create threads as buyer"
  ON threads FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id AND
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = threads.listing_id
      AND listings.user_id = threads.seller_id
      AND listings.user_id != auth.uid() -- Can't message yourself
    )
  );

-- Users can update threads they're part of
CREATE POLICY "Users can update own threads"
  ON threads FOR UPDATE
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- =====================================================
-- MESSAGES POLICIES
-- =====================================================

-- Users can view messages in their threads
CREATE POLICY "Users can view messages in own threads"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM threads
      WHERE threads.id = messages.thread_id
      AND (threads.buyer_id = auth.uid() OR threads.seller_id = auth.uid())
    )
  );

-- Users can send messages in their threads
CREATE POLICY "Users can send messages in own threads"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM threads
      WHERE threads.id = messages.thread_id
      AND (threads.buyer_id = auth.uid() OR threads.seller_id = auth.uid())
    )
  );

-- Users can update their own messages (for read status)
CREATE POLICY "Users can update messages in own threads"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM threads
      WHERE threads.id = messages.thread_id
      AND (threads.buyer_id = auth.uid() OR threads.seller_id = auth.uid())
    )
  );

-- =====================================================
-- BOOSTS POLICIES
-- =====================================================

-- Users can view their own boosts
CREATE POLICY "Users can view own boosts"
  ON boosts FOR SELECT
  USING (user_id = auth.uid());

-- Users can create boosts for their own listings
CREATE POLICY "Users can create boosts for own listings"
  ON boosts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = boosts.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- Users can update their own boosts
CREATE POLICY "Users can update own boosts"
  ON boosts FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRANSACTIONS POLICIES
-- =====================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own transactions
CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- REPORTS POLICIES
-- =====================================================

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Users can create reports
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boosts_updated_at BEFORE UPDATE ON boosts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update thread's last_message_at
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads
  SET last_message_at = NEW.created_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_on_new_message AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_thread_last_message();

-- Function to increment auction bid count
CREATE OR REPLACE FUNCTION increment_auction_bids()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auctions
  SET
    total_bids = total_bids + 1,
    current_price = NEW.amount,
    leading_bidder_id = NEW.user_id
  WHERE id = NEW.auction_id;

  -- Mark previous bids as outbid
  UPDATE bids
  SET status = 'outbid'
  WHERE auction_id = NEW.auction_id
  AND id != NEW.id
  AND status = 'active';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_auction_on_new_bid AFTER INSERT ON bids
  FOR EACH ROW EXECUTE FUNCTION increment_auction_bids();

-- Function to increment listing views
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE listings
  SET views = views + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA (Optional)
-- =====================================================

-- Add categories (can be expanded later)
-- We'll use a simple varchar for now, but you can create a categories table if needed

COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE listings IS 'Main listings table supporting both fixed price and auction items';
COMMENT ON TABLE auctions IS 'Auction-specific data extending listings';
COMMENT ON TABLE bids IS 'Bids placed on auctions with atomic updates';
COMMENT ON TABLE threads IS 'Chat conversations between buyers and sellers';
COMMENT ON TABLE messages IS 'Individual messages within threads';
COMMENT ON TABLE boosts IS 'Paid promotions for listings';
COMMENT ON TABLE transactions IS 'Financial transaction records';
COMMENT ON TABLE reports IS 'User-reported content moderation';
