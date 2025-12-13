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
export async function getUserThreads(userId: string): Promise<ThreadWithDetails[]> {
  const supabase = createClient()

  const { data, error } = await supabase
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
        email,
        display_name,
        avatar_url,
        phone_number,
        language_preference
      ),
      seller:users!threads_seller_id_fkey (
        id,
        email,
        display_name,
        avatar_url,
        phone_number,
        language_preference
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
export async function getThread(threadId: string, userId: string): Promise<ThreadWithDetails | null> {
  const supabase = createClient()

  const { data, error } = await supabase
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
        email,
        display_name,
        avatar_url,
        phone_number,
        language_preference
      ),
      seller:users!threads_seller_id_fkey (
        id,
        email,
        display_name,
        avatar_url,
        phone_number,
        language_preference
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
  buyerId: string
): Promise<{ thread: Thread; isNew: boolean }> {
  const supabase = createClient()

  // First, get the listing to find the seller
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('user_id')
    .eq('id', listingId)
    .single()

  if (listingError || !listing) {
    throw new Error('Listing not found')
  }

  const sellerId = (listing as any).user_id

  // Check for existing thread
  const { data: existingThread, error: findError } = await supabase
    .from('threads')
    .select('*')
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .single()

  if (existingThread && !findError) {
    return { thread: existingThread as Thread, isNew: false }
  }

  // Create new thread
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

  if (createError || !newThread) {
    throw new Error('Failed to create thread')
  }

  return { thread: newThread as Thread, isNew: true }
}

/**
 * Get total unread message count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()

  // Get all threads for user
  const { data: threads, error: threadsError } = await supabase
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
  const { count, error: countError } = await supabase
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
