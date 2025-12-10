-- =====================================================
-- Switch from Phone Auth to Social Auth (Google/Facebook)
-- =====================================================

-- Modify users table to use email instead of phone
ALTER TABLE users
  DROP COLUMN phone,
  ADD COLUMN email VARCHAR(255) UNIQUE;

-- Update comment
COMMENT ON TABLE users IS 'User profiles with social authentication (Google/Facebook)';
COMMENT ON COLUMN users.email IS 'User email from Google/Facebook OAuth';
