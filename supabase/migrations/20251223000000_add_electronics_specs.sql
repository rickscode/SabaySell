-- Add electronics specifications columns to listings table
-- Migration: 20251223000000_add_electronics_specs
-- Created: 2025-12-23
-- Purpose: Add structured product specs for electronics (Brand, Model, Storage, RAM, etc.)

-- Add dedicated columns for SEO-critical fields
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS brand VARCHAR(50),
ADD COLUMN IF NOT EXISTS model VARCHAR(100),
ADD COLUMN IF NOT EXISTS storage VARCHAR(20),
ADD COLUMN IF NOT EXISTS ram VARCHAR(20),
ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;

-- Create partial indexes for filtering and search (only index non-null values)
CREATE INDEX IF NOT EXISTS idx_listings_brand ON listings(brand) WHERE brand IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_model ON listings(model) WHERE model IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_storage ON listings(storage) WHERE storage IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_ram ON listings(ram) WHERE ram IS NOT NULL;

-- Create GIN index for JSONB specs column (for flexible category-specific fields)
CREATE INDEX IF NOT EXISTS idx_listings_specs ON listings USING gin(specs);

-- Add comments for documentation
COMMENT ON COLUMN listings.brand IS 'Product brand (e.g., Apple, Samsung, Huawei)';
COMMENT ON COLUMN listings.model IS 'Product model (e.g., iPhone 15 Pro Max, Galaxy S24 Ultra)';
COMMENT ON COLUMN listings.storage IS 'Storage capacity (e.g., 64GB, 128GB, 256GB, 512GB, 1TB)';
COMMENT ON COLUMN listings.ram IS 'RAM capacity (e.g., 4GB, 8GB, 16GB, 32GB)';
COMMENT ON COLUMN listings.specs IS 'Additional category-specific specs stored as JSONB (color, screen_size, processor, etc.)';
