-- =====================================================
-- Auto User Profile Creation & Storage Bucket Setup
-- =====================================================
-- This migration:
-- 1. Creates a trigger to automatically create user profiles
-- 2. Creates the listing-images storage bucket
-- 3. Sets up storage policies
-- =====================================================

-- =====================================================
-- 1. Auto-Create User Profile Trigger Function
-- =====================================================

-- Function to automatically create a user profile when a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new user profile with data from auth.users
  INSERT INTO public.users (
    id,
    email,
    display_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. Storage Bucket Setup
-- =====================================================

-- Create the listing-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,  -- Public bucket (images are publicly accessible)
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- 3. Storage Policies (RLS for listing-images bucket)
-- =====================================================

-- Allow anyone to view images (public read)
DROP POLICY IF EXISTS "Public read access for listing images" ON storage.objects;
CREATE POLICY "Public read access for listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload images to their own folder
DROP POLICY IF EXISTS "Users can upload their own listing images" ON storage.objects;
CREATE POLICY "Users can upload their own listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own images
DROP POLICY IF EXISTS "Users can update their own listing images" ON storage.objects;
CREATE POLICY "Users can update their own listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own images
DROP POLICY IF EXISTS "Users can delete their own listing images" ON storage.objects;
CREATE POLICY "Users can delete their own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 4. Comments
-- =====================================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a user profile in public.users when a new auth.users record is created';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Trigger to auto-create user profiles on signup';
