
import { supabase } from '@/integrations/supabase/client';
import { ChatThread, ChatMessage } from '@/types/mechanic';

/**
 * Find or create a chat thread between two users
 */
export async function findOrCreateChatThread(
  customerId: string,
  customerName: string,
  mechanicId: string,
  mechanicName: string
): Promise<ChatThread> {
  try {
    console.log(`Looking for thread between ${customerId} and ${mechanicId}`);
    
    // Check if a thread already exists between these users
    const { data: threads, error } = await supabase
      .from('chat_threads')
      .select('*')
      .filter('participants', 'cs', `{${customerId},${mechanicId}}`)
      .order('last_message_at', { ascending: false });
      
    if (error) throw error;
    
    // If thread exists, return the first one
    if (threads && threads.length > 0) {
      console.log('Found existing thread:', threads[0]);
      
      // Convert the Supabase format to our local format
      const participantNames: Record<string, string> = {};
      
      try {
        // Check if participantNames is a string (JSON)
        if (typeof threads[0].participant_names === 'string') {
          // Parse the JSON string
          const parsed = JSON.parse(threads[0].participant_names);
          // Copy properties
          Object.assign(participantNames, parsed);
        } else {
          // It's already an object, copy properties
          Object.assign(participantNames, threads[0].participant_names);
        }
      } catch (e) {
        console.error("Error parsing participant names:", e);
        // Fallback: create new names object
        participantNames[customerId] = customerName;
        participantNames[mechanicId] = mechanicName;
      }
      
      return {
        id: threads[0].id,
        participants: threads[0].participants,
        participantNames: participantNames,
        lastMessageAt: threads[0].last_message_at,
        unreadCount: threads[0].unread_count || 0
      };
    }
    
    // No thread exists, create a new one
    const participants = [customerId, mechanicId];
    const participantNames: Record<string, string> = {
      [customerId]: customerName,
      [mechanicId]: mechanicName
    };
    
    const { data: newThread, error: createError } = await supabase
      .from('chat_threads')
      .insert({
        participants,
        participant_names: participantNames,
      })
      .select()
      .single();
      
    if (createError) {
      throw createError;
    }
    
    if (!newThread) {
      throw new Error("Failed to create chat thread");
    }
    
    console.log('Created new thread:', newThread);
    
    return {
      id: newThread.id,
      participants: newThread.participants,
      participantNames: participantNames as Record<string, string>,
      lastMessageAt: newThread.last_message_at,
      unreadCount: 0
    };
  } catch (error) {
    console.error('Error in findOrCreateChatThread:', error);
    throw error;
  }
}

/**
 * Get all chat threads for a user
 */
export async function getChatThreads(userId: string): Promise<ChatThread[]> {
  console.log(`Getting chat threads for user ${userId}`);
  try {
    // Query for threads where user is a participant
    const { data: threads, error } = await supabase
      .from('chat_threads')
      .select('*')
      .filter('participants', 'cs', `{${userId}}`)
      .order('last_message_at', { ascending: false });
    
    if (error) throw error;
    
    if (!threads) return [];
    
    console.log(`Found ${threads.length} threads for user ${userId}`, threads);
    
    // Convert to ChatThread format
    return threads.map(thread => {
      // Process participant names
      let participantNames: Record<string, string> = {};
      
      try {
        // Handle JSON string or object
        if (typeof thread.participant_names === 'string') {
          participantNames = JSON.parse(thread.participant_names);
        } else {
          Object.assign(participantNames, thread.participant_names);
        }
      } catch (e) {
        console.error("Error parsing participant names in getChatThreads:", e);
        // Create default names if parsing fails
        thread.participants.forEach((participantId: string) => {
          participantNames[participantId] = participantId === userId ? 'You' : 'User';
        });
      }
      
      // Create the ChatThread object
      return {
        id: thread.id,
        participants: thread.participants,
        participantNames: participantNames,
        lastMessageAt: thread.last_message_at,
        unreadCount: thread.unread_count || 0
      };
    });
  } catch (error) {
    console.error('Error getting chat threads:', error);
    return []; // Return empty array on error
  }
}

/**
 * Get messages for a specific thread
 */
export async function getChatMessages(threadId: string): Promise<ChatMessage[]> {
  try {
    console.log(`Getting messages for thread ${threadId}`);
    
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('timestamp', { ascending: true });
      
    if (error) throw error;
    
    if (!messages) return [];
    
    console.log(`Found ${messages.length} messages for thread ${threadId}`);
    
    // Convert to ChatMessage format
    return messages.map(message => ({
      id: message.id,
      senderId: message.sender_id,
      senderName: message.sender_name,
      receiverId: message.receiver_id,
      content: message.content,
      timestamp: message.timestamp,
      isRead: message.is_read
    }));
  } catch (error) {
    console.error('Error getting chat messages:', error);
    return [];
  }
}

/**
 * Send a new message in a thread
 */
export async function sendChatMessage(
  threadId: string, 
  message: { 
    senderId: string; 
    senderName: string; 
    receiverId: string; 
    content: string;
    timestamp: string;
    isRead: boolean;
  }
): Promise<ChatMessage> {
  try {
    console.log(`Sending message to thread ${threadId}:`, message);
    
    // First, insert the message
    const { data: newMessage, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: threadId,
        sender_id: message.senderId,
        sender_name: message.senderName,
        receiver_id: message.receiverId,
        content: message.content,
        timestamp: message.timestamp,
        is_read: message.isRead
      })
      .select()
      .single();
      
    if (messageError) throw messageError;
    
    if (!newMessage) {
      throw new Error("Failed to save chat message");
    }
    
    // Update the thread's last_message_at and unread_count
    const { data: threadData, error: threadError } = await supabase
      .from('chat_threads')
      .select('unread_count, participant_names')
      .eq('id', threadId)
      .single();
    
    if (threadError) {
      console.error("Error getting thread data:", threadError);
    }
    
    // Safely parse participant names
    let participantNames: Record<string, string> = {};
    if (threadData) {
      try {
        if (typeof threadData.participant_names === 'string') {
          participantNames = JSON.parse(threadData.participant_names);
        } else {
          Object.assign(participantNames, threadData.participant_names);
        }
      } catch (e) {
        console.error("Error parsing participant names:", e);
      }
    }
    
    const unreadCount = threadData ? Number(threadData.unread_count || 0) + 1 : 1;
    
    const { error: updateError } = await supabase
      .from('chat_threads')
      .update({ 
        last_message_at: message.timestamp,
        unread_count: unreadCount
      })
      .eq('id', threadId);
      
    if (updateError) {
      console.error("Error updating thread:", updateError);
    }
    
    console.log('Message sent successfully');
    
    return {
      id: newMessage.id,
      senderId: newMessage.sender_id,
      senderName: newMessage.sender_name,
      receiverId: newMessage.receiver_id,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
      isRead: newMessage.is_read
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Mark messages as read in a thread
 */
export async function markMessagesAsRead(threadId: string, userId: string): Promise<void> {
  try {
    // Mark all messages to this user as read
    const { error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('thread_id', threadId)
      .eq('receiver_id', userId)
      .eq('is_read', false);
      
    if (error) throw error;
    
    // Reset unread counter in thread for this user
    const { error: threadUpdateError } = await supabase
      .from('chat_threads')
      .update({ unread_count: 0 })
      .eq('id', threadId);
      
    if (threadUpdateError) {
      console.error("Error resetting unread count:", threadUpdateError);
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}
