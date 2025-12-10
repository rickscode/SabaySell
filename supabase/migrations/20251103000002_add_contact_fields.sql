-- =====================================================
-- Add Telegram and WhatsApp Contact Fields
-- =====================================================
-- Adds required contact fields for marketing and communication
-- =====================================================

-- Add telegram and whatsapp columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS telegram VARCHAR(100),
  ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_telegram ON users(telegram);
CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON users(whatsapp);

-- Add comments
COMMENT ON COLUMN users.telegram IS 'Telegram username or phone number (required for marketing and communication)';
COMMENT ON COLUMN users.whatsapp IS 'WhatsApp number (required for marketing and communication)';

-- Note: Fields are nullable in database to allow gradual migration of existing users,
-- but will be enforced as required in the application layer for new users
