-- =====================================================
-- Add Missing User Profile Fields
-- =====================================================
-- Adds fields to match the profile template design
-- =====================================================

-- Add new columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS response_rate INTEGER DEFAULT 0 CHECK (response_rate >= 0 AND response_rate <= 100),
  ADD COLUMN IF NOT EXISTS response_time VARCHAR(50),
  ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0 CHECK (followers_count >= 0),
  ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0 CHECK (following_count >= 0);

-- Update the trigger function to also set username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_username TEXT;
BEGIN
  -- Generate username from email (part before @)
  default_username := split_part(NEW.email, '@', 1);

  -- Make sure username is unique by appending random number if needed
  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = default_username) LOOP
    default_username := split_part(NEW.email, '@', 1) || floor(random() * 10000)::text;
  END LOOP;

  -- Insert a new user profile with data from auth.users
  INSERT INTO public.users (
    id,
    email,
    username,
    display_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Add comments
COMMENT ON COLUMN users.username IS 'Unique username for profile URLs (e.g., @username)';
COMMENT ON COLUMN users.verified IS 'Verified seller badge';
COMMENT ON COLUMN users.response_rate IS 'Message response rate percentage (0-100)';
COMMENT ON COLUMN users.response_time IS 'Average response time (e.g., "within 2 hours")';
COMMENT ON COLUMN users.followers_count IS 'Number of users following this user';
COMMENT ON COLUMN users.following_count IS 'Number of users this user is following';
