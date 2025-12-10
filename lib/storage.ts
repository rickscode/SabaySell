// =====================================================
// Supabase Storage Utilities
// Handles image uploads for listings
// =====================================================

import { createServerClient } from '@/lib/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const BUCKET_NAME = 'listing-images'

export interface UploadResult {
  url: string
  path: string
}

/**
 * Upload an image to Supabase Storage
 * Files are stored in user-specific folders: {userId}/{listingId}/{filename}
 */
export async function uploadListingImage(
  file: File,
  userId: string,
  listingId: string
): Promise<UploadResult> {
  // Validate file
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`)
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  const supabase = await createServerClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${userId}/${listingId}/${fileName}`

  // Upload to storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Storage upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return {
    url: publicUrl,
    path: data.path
  }
}

/**
 * Upload multiple images for a listing
 * Returns array of upload results
 */
export async function uploadListingImages(
  files: File[],
  userId: string,
  listingId: string
): Promise<UploadResult[]> {
  if (files.length > 6) {
    throw new Error('Maximum 6 images allowed per listing')
  }

  const uploadPromises = files.map(file => uploadListingImage(file, userId, listingId))
  return Promise.all(uploadPromises)
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteListingImage(storagePath: string): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath])

  if (error) {
    console.error('Storage delete error:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

/**
 * Delete multiple images
 */
export async function deleteListingImages(storagePaths: string[]): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(storagePaths)

  if (error) {
    console.error('Storage delete error:', error)
    throw new Error(`Failed to delete images: ${error.message}`)
  }
}

/**
 * Get public URL for a storage path
 */
export async function getPublicUrl(storagePath: string): Promise<string> {
  const supabase = await createServerClient()

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath)

  return publicUrl
}
