import { createClient } from './supabase'
import type { User } from './database.types'

// =====================================================
// SOCIAL AUTH UTILITIES
// =====================================================

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error };
}

/**
 * Sign in with Facebook
 */
export async function signInWithFacebook() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const { session } = await getSession();
  return !!session;
}

// =====================================================
// USER PROFILE UTILITIES
// =====================================================

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  return { data, error }
}

/**
 * Create user profile (called after successful OAuth signup)
 */
export async function createUserProfile(userId: string, email: string | null = null) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'email' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

/**
 * Check if user profile is complete
 */
export async function isProfileComplete(userId: string) {
  const { data } = await getUserProfile(userId);
  return !!data?.display_name;
}

// =====================================================
// AUTH EVENT LISTENERS
// =====================================================

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient()
  return supabase.auth.onAuthStateChange(callback)
}
