'use server'

// =====================================================
// Listing Server Actions
// Mutations for creating, updating, and deleting listings
// =====================================================

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import {
  uploadListingImages,
  deleteListingImage,
  deleteListingImages
} from '@/lib/storage'
import type {
  ListingInsert,
  ListingUpdate,
  ImageInsert,
  ListingType,
  ListingCondition,
  AuctionInsert
} from '@/lib/database.types'

export interface CreateListingData {
  // Basic info
  type?: ListingType
  title_en?: string
  title_km?: string
  description_en?: string
  description_km?: string
  category?: string
  condition?: ListingCondition
  location?: string

  // Pricing
  price?: number
  currency?: string
  is_negotiable?: boolean
  quantity?: number

  // Shipping
  shipping_free?: boolean
  shipping_paid?: boolean
  local_pickup?: boolean
  shipping_cost?: number

  // Auction specific
  start_price?: number
  min_increment?: number
  reserve_price?: number
  auction_duration_hours?: number

  // Status
  status?: 'draft' | 'active' | 'sold' | 'expired' | 'removed'
}

export interface CreateListingResult {
  success: boolean
  listingId?: string
  error?: string
}

/**
 * Create a new listing (draft or published)
 */
export async function createListing(
  data: CreateListingData
): Promise<CreateListingResult> {
  try {
    // Get user from server client (for server actions)
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate required fields for creation
    if (!data.type || !data.title_en || !data.description_en || !data.category || !data.location) {
      return { success: false, error: 'Missing required fields' }
    }

    // Prepare listing data
    const listingData: ListingInsert = {
      user_id: user.id,
      type: data.type,
      status: data.status || 'draft',
      title_en: data.title_en,
      title_km: data.title_km || null,
      description_en: data.description_en,
      description_km: data.description_km || null,
      category: data.category,
      condition: data.condition || null,
      location: data.location,
      price: data.type === 'fixed' ? data.price || null : null,
      currency: data.currency || 'USD',
      is_negotiable: data.is_negotiable !== undefined ? data.is_negotiable : true,
      quantity: data.quantity || 1,
      shipping_free: data.shipping_free || false,
      shipping_paid: data.shipping_paid || false,
      local_pickup: data.local_pickup || false,
      shipping_cost: data.shipping_cost || 0,
      published_at: data.status === 'active' ? new Date().toISOString() : null
    }

    // Insert listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert(listingData as any)
      .select()
      .single()

    if (listingError) {
      console.error('Error creating listing:', listingError)
      return { success: false, error: 'Failed to create listing' }
    }

    // If auction type, create auction record
    if (data.type === 'auction' && data.start_price) {
      const auctionData: AuctionInsert = {
        listing_id: (listing as any).id,
        status: 'upcoming',
        start_price: data.start_price,
        current_price: data.start_price,
        min_increment: data.min_increment || 1.00,
        reserve_price: data.reserve_price || null,
        starts_at: new Date().toISOString(),
        ends_at: new Date(
          Date.now() + (data.auction_duration_hours || 168) * 60 * 60 * 1000
        ).toISOString()
      }

      const { error: auctionError } = await supabase
        .from('auctions')
        .insert(auctionData as any)

      if (auctionError) {
        console.error('Error creating auction:', auctionError)
        // Rollback listing
        await supabase.from('listings').delete().eq('id', (listing as any).id)
        return { success: false, error: 'Failed to create auction' }
      }
    }

    revalidatePath('/')
    revalidatePath('/listings')

    return { success: true, listingId: (listing as any).id }
  } catch (error) {
    console.error('Unexpected error creating listing:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Upload images for a listing
 */
export async function uploadImagesForListing(
  listingId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user from server client (for server actions)
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify listing ownership
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return { success: false, error: 'Listing not found' }
    }

    if ((listing as any).user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Get existing images count
    const { count } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', listingId)

    const existingCount = count || 0

    // Get files from FormData
    const files: File[] = []
    formData.forEach((value) => {
      if (value instanceof File) {
        files.push(value)
      }
    })

    if (files.length === 0) {
      return { success: false, error: 'No files provided' }
    }

    if (existingCount + files.length > 6) {
      return {
        success: false,
        error: `Maximum 6 images allowed. You can upload ${6 - existingCount} more.`
      }
    }

    // Upload to storage
    const uploadResults = await uploadListingImages(files, user.id, listingId)

    // Create image records in database
    const imageInserts: ImageInsert[] = uploadResults.map((result, index) => ({
      listing_id: listingId,
      storage_path: result.path,
      url: result.url,
      display_order: existingCount + index,
      is_primary: existingCount === 0 && index === 0 // First image is primary
    }))

    const { error: insertError } = await supabase
      .from('images')
      .insert(imageInserts as any)

    if (insertError) {
      console.error('Error inserting image records:', insertError)
      // Cleanup uploaded files
      await deleteListingImages(uploadResults.map(r => r.path))
      return { success: false, error: 'Failed to save image records' }
    }

    revalidatePath(`/listings/${listingId}`)
    revalidatePath('/listings')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error uploading images:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Delete an image from a listing
 */
export async function deleteImageFromListing(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user from server client (for server actions)
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get image with listing ownership check
    const { data: image, error: imageError } = await supabase
      .from('images')
      .select(`
        *,
        listing:listings (
          user_id
        )
      `)
      .eq('id', imageId)
      .single()

    if (imageError || !image) {
      return { success: false, error: 'Image not found' }
    }

    if (((image as any).listing as any).user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Delete from storage
    await deleteListingImage((image as any).storage_path)

    // Delete from database
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId)

    if (deleteError) {
      console.error('Error deleting image record:', deleteError)
      return { success: false, error: 'Failed to delete image' }
    }

    revalidatePath(`/listings/${(image as any).listing_id}`)
    revalidatePath('/listings')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting image:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Update a listing
 */
export async function updateListing(
  listingId: string,
  data: Partial<CreateListingData>
): Promise<CreateListingResult> {
  try {
    // Get user from server client (for server actions)
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('listings')
      .select('user_id, type')
      .eq('id', listingId)
      .single()

    if (fetchError || !existing) {
      return { success: false, error: 'Listing not found' }
    }

    if ((existing as any).user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Prepare update data
    const updateData: ListingUpdate = {
      updated_at: new Date().toISOString()
    }

    if (data.title_en) updateData.title_en = data.title_en
    if (data.title_km !== undefined) updateData.title_km = data.title_km
    if (data.description_en) updateData.description_en = data.description_en
    if (data.description_km !== undefined) updateData.description_km = data.description_km
    if (data.category) updateData.category = data.category
    if (data.condition !== undefined) updateData.condition = data.condition
    if (data.location) updateData.location = data.location
    if (data.price !== undefined) updateData.price = data.price
    if (data.is_negotiable !== undefined) updateData.is_negotiable = data.is_negotiable
    if (data.quantity !== undefined) updateData.quantity = data.quantity
    if (data.status !== undefined) {
      updateData.status = data.status
      if (data.status === 'active' && !existing) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // Update listing
    const { error: updateError } = await (supabase
      .from('listings') as any)
      .update(updateData)
      .eq('id', listingId)

    if (updateError) {
      console.error('Error updating listing:', updateError)
      return { success: false, error: 'Failed to update listing' }
    }

    revalidatePath(`/listings/${listingId}`)
    revalidatePath('/listings')
    revalidatePath('/')

    return { success: true, listingId }
  } catch (error) {
    console.error('Unexpected error updating listing:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Delete a listing (soft delete - sets status to 'removed')
 */
export async function deleteListing(
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user from server client (for server actions)
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify ownership
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single()

    if (fetchError || !listing) {
      return { success: false, error: 'Listing not found' }
    }

    if ((listing as any).user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Soft delete
    const { error: deleteError } = await (supabase
      .from('listings') as any)
      .update({ status: 'removed' })
      .eq('id', listingId)

    if (deleteError) {
      console.error('Error deleting listing:', deleteError)
      return { success: false, error: 'Failed to delete listing' }
    }

    revalidatePath('/listings')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting listing:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Publish a draft listing
 */
export async function publishListing(
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  return updateListing(listingId, { status: 'active' })
}

/**
 * Reorder images for a listing
 */
export async function reorderListingImages(
  listingId: string,
  imageIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user from server client (for server actions)
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify ownership
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return { success: false, error: 'Listing not found' }
    }

    if ((listing as any).user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Update display order for each image
    for (let i = 0; i < imageIds.length; i++) {
      await (supabase
        .from('images') as any)
        .update({ display_order: i, is_primary: i === 0 })
        .eq('id', imageIds[i])
        .eq('listing_id', listingId)
    }

    revalidatePath(`/listings/${listingId}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error reordering images:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}
