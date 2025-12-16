// =====================================================
// Message & Thread Query Functions
// Data fetching for messaging system
// =====================================================

import { createClient } from '@/lib/supabase'
import type {
  Thread,
  Message,
  ThreadWithMessages,
  MessageWithSender,
  Listing,
  User
} from '@/lib/database.types'

export interface ThreadWithDetails extends Thread {
  listing: Listing & {
    images: Array<{
      id: string
      url: string
      display_order: number
    }>
  }
  buyer: User
  seller: User
  messages: MessageWithSender[]
  unread_count?: number
}

/**
 * Get all threads for a user (as buyer or seller)
 */
export async function getUserThreads(userId: string, supabase?: any): Promise<ThreadWithDetails[]> {
  const client = supabase || createClient()

  const { data, error } = await client
    .from('threads')
    .select(`
      *,
      listing:listings (
        *,
        images (
          id,
          url,
          display_order
        )
      ),
      buyer:users!threads_buyer_id_fkey (
        id,
        display_name,
        avatar_url,
        phone
      ),
      seller:users!threads_seller_id_fkey (
        id,
        display_name,
        avatar_url,
        phone
      ),
      messages (
        *,
        sender:users (
          id,
          display_name,
          avatar_url
        )
      )
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .eq('is_archived_by_buyer', false)
    .eq('is_archived_by_seller', false)
    .order('last_message_at', { ascending: false })

  if (error) {
    console.error('Error fetching user threads:', error)
    return []
  }

  // Calculate unread count for each thread
  const threadsWithUnreadCount = (data as any[]).map(thread => {
    const unreadMessages = thread.messages?.filter(
      (msg: any) => !msg.is_read && msg.sender_id !== userId
    ) || []

    return {
      ...thread,
      unread_count: unreadMessages.length
    }
  })

  return threadsWithUnreadCount
}

/**
 * Get a single thread by ID with access check
 */
export async function getThread(threadId: string, userId: string, supabase?: any): Promise<ThreadWithDetails | null> {
  const client = supabase || createClient()

  const { data, error } = await client
    .from('threads')
    .select(`
      *,
      listing:listings (
        *,
        images (
          id,
          url,
          display_order
        )
      ),
      buyer:users!threads_buyer_id_fkey (
        id,
        display_name,
        avatar_url,
        phone
      ),
      seller:users!threads_seller_id_fkey (
        id,
        display_name,
        avatar_url,
        phone
      ),
      messages (
        *,
        sender:users (
          id,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('id', threadId)
    .single()

  if (error) {
    console.error('Error fetching thread:', error)
    return null
  }

  const thread = data as any

  // Verify user has access to this thread
  if (thread.buyer_id !== userId && thread.seller_id !== userId) {
    console.error('Unauthorized: User does not have access to this thread')
    return null
  }

  // Calculate unread count
  const unreadMessages = thread.messages?.filter(
    (msg: any) => !msg.is_read && msg.sender_id !== userId
  ) || []

  return {
    ...thread,
    unread_count: unreadMessages.length
  }
}

/**
 * Find existing thread or create new one for a listing
 */
export async function findOrCreateThread(
  listingId: string,
  buyerId: string,
  supabase: any
): Promise<{ thread: Thread; isNew: boolean }> {
  console.log('🔵 findOrCreateThread() called:', { listingId, buyerId });

  // First, get the listing to find the seller
  console.log('🔵 Fetching listing to get seller...');
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('user_id')
    .eq('id', listingId)
    .single()

  console.log('🔵 Listing result:', { listing, listingError });

  if (listingError || !listing) {
    console.error('❌ Listing not found');
    throw new Error('Listing not found')
  }

  const sellerId = (listing as any).user_id
  console.log('🔵 Seller ID:', sellerId);

  // Check for existing thread
  console.log('🔵 Checking for existing thread...');
  const { data: existingThread, error: findError } = await supabase
    .from('threads')
    .select('*')
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .single()

  console.log('🔵 Existing thread search:', { existingThread, findError });

  if (existingThread && !findError) {
    console.log('✅ Found existing thread:', existingThread.id);
    return { thread: existingThread as Thread, isNew: false }
  }

  // Create new thread
  console.log('🔵 Creating new thread:', { listingId, buyerId, sellerId });
  const { data: newThread, error: createError } = await supabase
    .from('threads')
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      is_archived_by_buyer: false,
      is_archived_by_seller: false,
      is_blocked: false,
      last_message_at: new Date().toISOString()
    })
    .select()
    .single()

  console.log('🔵 Thread creation result:', { newThread, createError });

  if (createError || !newThread) {
    console.error('❌ Failed to create thread:', createError);
    throw new Error(`Failed to create thread: ${createError?.message || 'Unknown error'}`)
  }

  console.log('✅ Created new thread:', newThread.id);
  return { thread: newThread as Thread, isNew: true }
}

/**
 * Get total unread message count for a user
 */
export async function getUnreadCount(userId: string, supabase?: any): Promise<number> {
  const client = supabase || createClient()

  // Get all threads for user
  const { data: threads, error: threadsError } = await client
    .from('threads')
    .select('id')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .eq('is_archived_by_buyer', false)
    .eq('is_archived_by_seller', false)

  if (threadsError || !threads) {
    console.error('Error fetching threads for unread count:', threadsError)
    return 0
  }

  const threadIds = threads.map((t: any) => t.id)

  if (threadIds.length === 0) {
    return 0
  }

  // Count unread messages in those threads where sender is not the current user
  const { count, error: countError } = await client
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .in('thread_id', threadIds)
    .eq('is_read', false)
    .neq('sender_id', userId)

  if (countError) {
    console.error('Error counting unread messages:', countError)
    return 0
  }

  return count || 0
}

/**
 * Get messages for a thread with access check
 */
export async function getThreadMessages(
  threadId: string,
  userId: string
): Promise<MessageWithSender[]> {
  const supabase = createClient()

  // First verify user has access to this thread
  const { data: thread, error: threadError } = await supabase
    .from('threads')
    .select('buyer_id, seller_id')
    .eq('id', threadId)
    .single()

  if (threadError || !thread) {
    console.error('Thread not found:', threadError)
    return []
  }

  const threadData = thread as any
  if (threadData.buyer_id !== userId && threadData.seller_id !== userId) {
    console.error('Unauthorized: User does not have access to this thread')
    return []
  }

  // Fetch messages
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching thread messages:', error)
    return []
  }

  return (data as any[]) || []
}
