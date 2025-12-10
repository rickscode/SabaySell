-- =====================================================
-- Add Favorites and Notifications Tables
-- Session 1: Backend Implementation
-- =====================================================

-- =====================================================
-- FAVORITES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: user can only favorite a listing once
  UNIQUE(user_id, listing_id)
);

-- Index for fast lookups
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- RLS Policies for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGER: Update listings.favorites count
-- =====================================================

-- Function to increment favorites count
CREATE OR REPLACE FUNCTION increment_listing_favorites()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE listings
  SET favorites = favorites + 1
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement favorites count
CREATE OR REPLACE FUNCTION decrement_listing_favorites()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE listings
  SET favorites = GREATEST(favorites - 1, 0)
  WHERE id = OLD.listing_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger on INSERT
CREATE TRIGGER on_favorite_added
  AFTER INSERT ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION increment_listing_favorites();

-- Trigger on DELETE
CREATE TRIGGER on_favorite_removed
  AFTER DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION decrement_listing_favorites();

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

-- Notification types enum
CREATE TYPE notification_type AS ENUM (
  'new_message',
  'outbid',
  'auction_ending_soon',
  'auction_won',
  'auction_lost',
  'listing_sold',
  'listing_expired',
  'boost_approved',
  'boost_rejected'
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  link VARCHAR(500),
  metadata JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- RLS Policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only system/admins can create notifications (via service role)
-- No INSERT policy for regular users

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title VARCHAR(200),
  p_body TEXT DEFAULT NULL,
  p_link VARCHAR(500) DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, body, link, metadata)
  VALUES (p_user_id, p_type, p_title, p_body, p_link, p_metadata)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = true, read_at = NOW()
  WHERE id = p_notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all user notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = true, read_at = NOW()
  WHERE user_id = auth.uid() AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM notifications
    WHERE user_id = p_user_id AND is_read = false
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE favorites IS 'User watchlist/favorites for listings';
COMMENT ON TABLE notifications IS 'User notifications for various events';
COMMENT ON FUNCTION create_notification IS 'Helper function to create a notification (service role only)';
COMMENT ON FUNCTION mark_notification_read IS 'Mark a single notification as read';
COMMENT ON FUNCTION mark_all_notifications_read IS 'Mark all user notifications as read';
