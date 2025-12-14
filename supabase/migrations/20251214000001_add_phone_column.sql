-- =====================================================
-- Add Phone Column to Users Table
-- =====================================================
-- Adds phone column for voice call numbers
-- Complements existing telegram and whatsapp columns
-- =====================================================

-- Add phone column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Add comment
COMMENT ON COLUMN users.phone IS 'Phone number for voice calls (with country code, e.g., +855 12 345 678)';
