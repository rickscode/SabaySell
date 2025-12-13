'use server'

// =====================================================
// Favorites Server Actions
// Mutations for adding/removing favorites
// =====================================================

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase'
import type { FavoriteInsert } from '@/lib/database.types'

export interface FavoriteResult {
  success: boolean
  error?: string
}

export interface ToggleFavoriteResult extends FavoriteResult {
  isFavorited: boolean
}

/**
 * Add a listing to user's favorites
 * Idempotent - returns success if already favorited
 */
export async function addToFavorites(
  listingId: string
): Promise<FavoriteResult> {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if already favorited (avoid duplicate error)
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listingId)
      .single()

    if (existing) {
      // Already favorited, treat as success (idempotent)
      return { success: true }
    }

    // Insert favorite
    const favoriteData: FavoriteInsert = {
      user_id: user.id,
      listing_id: listingId
    }

    const { error: insertError } = await supabase
      .from('favorites')
      .insert(favoriteData as any)

    if (insertError) {
      console.error('Error adding favorite:', insertError)
      return { success: false, error: 'Failed to add favorite' }
    }

    // Revalidate paths to reflect updated favorite count
    revalidatePath('/')
    revalidatePath('/listings')
    revalidatePath(`/listings/${listingId}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error adding favorite:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Remove a listing from user's favorites
 */
export async function removeFromFavorites(
  listingId: string
): Promise<FavoriteResult> {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Delete favorite
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId)

    if (deleteError) {
      console.error('Error removing favorite:', deleteError)
      return { success: false, error: 'Failed to remove favorite' }
    }

    // Revalidate paths to reflect updated favorite count
    revalidatePath('/')
    revalidatePath('/listings')
    revalidatePath(`/listings/${listingId}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error removing favorite:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Toggle favorite status for a listing
 * Checks current state and adds or removes accordingly
 */
export async function toggleFavorite(
  listingId: string
): Promise<ToggleFavoriteResult> {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, isFavorited: false, error: 'Not authenticated' }
    }

    // Check current state
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listingId)
      .single()

    if (existing) {
      // Remove favorite
      const result = await removeFromFavorites(listingId)
      return {
        success: result.success,
        isFavorited: false,
        error: result.error
      }
    } else {
      // Add favorite
      const result = await addToFavorites(listingId)
      return {
        success: result.success,
        isFavorited: true,
        error: result.error
      }
    }
  } catch (error) {
    console.error('Unexpected error toggling favorite:', error)
    return { success: false, isFavorited: false, error: 'Unexpected error occurred' }
  }
}
