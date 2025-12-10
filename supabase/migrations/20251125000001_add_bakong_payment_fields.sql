-- Migration: Add Bakong Payment Fields to Boosts Table
-- Date: 2025-11-25
-- Description: Add payment_hash and bakong_qr_string columns for Bakong Open API integration

-- Add payment_hash column (MD5 hash for tracking Bakong payments)
ALTER TABLE boosts
ADD COLUMN IF NOT EXISTS payment_hash VARCHAR(32);

-- Add bakong_qr_string column (stores the full KHQR string)
ALTER TABLE boosts
ADD COLUMN IF NOT EXISTS bakong_qr_string TEXT;

-- Create index on payment_hash for fast lookups during verification
CREATE INDEX IF NOT EXISTS idx_boosts_payment_hash ON boosts(payment_hash);

-- Add comment for documentation
COMMENT ON COLUMN boosts.payment_hash IS 'MD5 hash of Bakong KHQR string used for payment verification';
COMMENT ON COLUMN boosts.bakong_qr_string IS 'Full Bakong KHQR string generated for payment';

-- Note: payment_hash is unique per transaction and used to poll Bakong API
-- The bakong_qr_string is stored for reference and debugging purposes
