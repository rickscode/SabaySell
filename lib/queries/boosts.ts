import { createServerClient } from '@/lib/supabase';
import type { Boost, BoostInsert, BoostUpdate } from '@/lib/database.types';

/**
 * Insert a new boost record into the database
 */
export async function insertBoost(boost: BoostInsert): Promise<{ data: Boost | null; error: any }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('boosts')
    .insert(boost)
    .select()
    .single();

  return { data, error };
}

/**
 * Get a boost by payment reference
 */
export async function getBoostByPaymentReference(paymentReference: string): Promise<{ data: Boost | null; error: any }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('boosts')
    .select('*')
    .eq('payment_reference', paymentReference)
    .single();

  return { data, error };
}

/**
 * Get active boosts for a listing
 */
export async function getActiveBoostsByListing(listingId: string): Promise<{ data: Boost[] | null; error: any }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('boosts')
    .select('*')
    .eq('listing_id', listingId)
    .eq('status', 'active')
    .gte('ends_at', new Date().toISOString());

  return { data, error };
}

/**
 * Update boost status and related fields
 */
export async function updateBoostStatus(
  boostId: string,
  update: BoostUpdate
): Promise<{ data: Boost | null; error: any }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('boosts')
    .update(update)
    .eq('id', boostId)
    .select()
    .single();

  return { data, error };
}

/**
 * Get all boosts for a user
 */
export async function getUserBoosts(userId: string): Promise<{ data: Boost[] | null; error: any }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('boosts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Get expired boosts that need to be marked as expired
 */
export async function getExpiredBoosts(): Promise<{ data: Boost[] | null; error: any }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('boosts')
    .select('*')
    .eq('status', 'active')
    .lt('ends_at', new Date().toISOString());

  return { data, error };
}

/**
 * Get boost by ID
 */
export async function getBoostById(boostId: string): Promise<{ data: Boost | null; error: any }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('boosts')
    .select('*')
    .eq('id', boostId)
    .single();

  return { data, error };
}
