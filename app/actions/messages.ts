'use server'

// =====================================================
// Message & Thread Server Actions
// Mutations for messaging system
// =====================================================

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase'
import { findOrCreateThread } from '@/lib/queries/messages'
import type { MessageInsert } from '@/lib/database.types'

export interface SendMessageResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface CreateThreadResult {
  success: boolean
  threadId?: string
  messageId?: string
  error?: string
}

export interface MarkReadResult {
  success: boolean
  error?: string
}

export interface ArchiveThreadResult {
  success: boolean
  error?: string
}

/**
 * Send a message in an existing thread
 */
export async function sendMessage(
  threadId: string,
  body: string,
  attachmentUrl?: string
): Promise<SendMessageResult> {
  try {
    // Get authenticated user
    const supabase = await createServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      console.error('❌ Not authenticated:', authError);
      return { success: false, error: 'Not authenticated' }
    }

    // Validate message body
    if (!body || body.trim().length === 0) {
      console.error('❌ Empty message body');
      return { success: false, error: 'Message cannot be empty' }
    }

    // Get thread and verify user has access
    const { data: thread, error: threadError } = await supabase
      .from('threads')
      .select('buyer_id, seller_id, is_blocked')
      .eq('id', threadId)
      .single()

    if (threadError || !thread) {
      console.error('❌ Thread not found:', threadError);
      return { success: false, error: 'Thread not found' }
    }

    const threadData = thread as any

    // Verify user is buyer or seller
    if (threadData.buyer_id !== user.id && threadData.seller_id !== user.id) {
      console.error('❌ Not authorized:', {
        userId: user.id,
        buyerId: threadData.buyer_id,
        sellerId: threadData.seller_id
      });
      return { success: false, error: 'Not authorized' }
    }

    // Check if thread is blocked
    if (threadData.is_blocked) {
      console.error('❌ Thread blocked');
      return { success: false, error: 'This conversation has been blocked' }
    }

    // Insert message
    const messageData: MessageInsert = {
      thread_id: threadId,
      sender_id: user.id,
      body: body.trim(),
      is_read: false,
      read_at: null,
      attachment_url: attachmentUrl || null
    }

    const { data: newMessage, error: messageError } = await supabase
      .from('messages')
      .insert(messageData as any)
      .select()
      .single()

    if (messageError) {
      console.error('❌ Error inserting message:', messageError);
      return { success: false, error: 'Failed to send message' }
    }

    // Update thread's last_message_at
    const { error: updateThreadError } = await supabase
      .from('threads')
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', threadId)

    if (updateThreadError) {
      console.error('⚠️ Error updating thread:', updateThreadError);
    }

    // Revalidate paths
    // revalidatePath('/messages') // REMOVED - causes page reload, preventing open chat

    return {
      success: true,
      messageId: (newMessage as any).id
    }
  } catch (error) {
    console.error('💥 Unexpected error in sendMessage():', error);
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Create a new thread and send the first message
 */
export async function createThreadAndSendMessage(
  listingId: string,
  body: string,
  offer?: number
): Promise<CreateThreadResult> {
  try {
    // Get authenticated user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      console.error('❌ Not authenticated');
      return { success: false, error: 'Not authenticated' }
    }

    // Validate message body
    if (!body || body.trim().length === 0) {
      console.error('❌ Empty message');
      return { success: false, error: 'Message cannot be empty' }
    }

    // Get listing to check ownership
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      console.error('❌ Listing not found');
      return { success: false, error: 'Listing not found' }
    }

    const listingData = listing as any

    // Prevent self-messaging
    if (listingData.user_id === user.id) {
      console.error('❌ Self-messaging attempt');
      return {
        success: false,
        error: "You can't message yourself about your own listing"
      }
    }

    // Find or create thread
    const { thread, isNew } = await findOrCreateThread(listingId, user.id, supabase)

    // Format message body with offer if provided
    let messageBody = body.trim()
    if (offer && offer > 0) {
      messageBody += `\n\nMade an offer: $${offer.toFixed(2)}`
    }

    // Send the message
    const result = await sendMessage(thread.id, messageBody)

    if (!result.success) {
      console.error('❌ Failed to send message:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to send message'
      }
    }

    return {
      success: true,
      threadId: thread.id,
      messageId: result.messageId
    }
  } catch (error) {
    console.error('💥 Unexpected error in createThreadAndSendMessage():', error);
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Mark all messages in a thread as read
 */
export async function markMessagesAsRead(threadId: string): Promise<MarkReadResult> {
  try {
    // Get authenticated user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user has access to thread
    const { data: thread, error: threadError } = await supabase
      .from('threads')
      .select('buyer_id, seller_id')
      .eq('id', threadId)
      .single()

    if (threadError || !thread) {
      return { success: false, error: 'Thread not found' }
    }

    const threadData = thread as any

    if (threadData.buyer_id !== user.id && threadData.seller_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Mark all unread messages as read (except messages sent by current user)
    const { error: updateError } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('thread_id', threadId)
      .eq('is_read', false)
      .neq('sender_id', user.id)

    if (updateError) {
      console.error('Error marking messages as read:', updateError)
      return { success: false, error: 'Failed to mark messages as read' }
    }

    // Revalidate paths
    revalidatePath('/messages')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error marking messages as read:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Archive a thread for the current user
 */
export async function archiveThread(threadId: string): Promise<ArchiveThreadResult> {
  try {
    // Get authenticated user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get thread to determine if user is buyer or seller
    const { data: thread, error: threadError } = await supabase
      .from('threads')
      .select('buyer_id, seller_id')
      .eq('id', threadId)
      .single()

    if (threadError || !thread) {
      return { success: false, error: 'Thread not found' }
    }

    const threadData = thread as any

    // Determine which field to update
    let updateField: 'is_archived_by_buyer' | 'is_archived_by_seller'

    if (threadData.buyer_id === user.id) {
      updateField = 'is_archived_by_buyer'
    } else if (threadData.seller_id === user.id) {
      updateField = 'is_archived_by_seller'
    } else {
      return { success: false, error: 'Not authorized' }
    }

    // Archive the thread
    const { error: updateError } = await supabase
      .from('threads')
      .update({
        [updateField]: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', threadId)

    if (updateError) {
      console.error('Error archiving thread:', updateError)
      return { success: false, error: 'Failed to archive thread' }
    }

    // Revalidate paths
    revalidatePath('/messages')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error archiving thread:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}
