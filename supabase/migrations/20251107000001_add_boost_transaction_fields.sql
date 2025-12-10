-- Migration: Add transaction tracking fields to boosts table
-- Date: 2025-11-07
-- Purpose: Track PayPal transaction IDs and payer emails for payment verification

-- Add transaction_id column to store PayPal transaction ID
ALTER TABLE boosts
ADD COLUMN transaction_id VARCHAR(100);

-- Add payment_email column to store payer's email for matching
ALTER TABLE boosts
ADD COLUMN payment_email VARCHAR(255);

-- Create index on transaction_id for quick lookup and duplicate prevention
CREATE INDEX idx_boosts_transaction_id ON boosts(transaction_id);

-- Create index on payment_email for quick lookup during IPN processing
CREATE INDEX idx_boosts_payment_email ON boosts(payment_email);

-- Add unique constraint on transaction_id to prevent duplicate processing
-- (only for non-null values, as pending boosts won't have transaction_id yet)
CREATE UNIQUE INDEX idx_boosts_transaction_id_unique
ON boosts(transaction_id)
WHERE transaction_id IS NOT NULL;

-- Comment the new columns
COMMENT ON COLUMN boosts.transaction_id IS 'PayPal transaction ID (txn_id from IPN) for payment verification';
COMMENT ON COLUMN boosts.payment_email IS 'Email address of the PayPal payer for matching pending boosts';
