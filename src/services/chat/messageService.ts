
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/mechanic';

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
      
    if (messageError) {
      console.error("Message insertion error:", messageError);
      throw messageError;
    }
    
    if (!newMessage) {
      throw new Error("Failed to save chat message");
    }
    
    console.log("Message inserted successfully:", newMessage);
    
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
    
    const { data: updatedThreadData, error: updateError } = await supabase
      .from('chat_threads')
      .update({ 
        last_message_at: message.timestamp,
        unread_count: unreadCount
      })
      .eq('id', threadId)
      .select();
      
    if (updateError) {
      console.error("Error updating thread:", updateError);
    } else {
      console.log("Thread updated successfully:", updatedThreadData);
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
    console.log(`Marking messages as read for user ${userId} in thread ${threadId}`);
    
    // Mark all messages to this user as read
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('thread_id', threadId)
      .eq('receiver_id', userId)
      .eq('is_read', false)
      .select();
      
    if (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
    
    console.log(`Marked ${messages?.length || 0} messages as read`);
    
    // Reset unread counter in thread for this user
    const { data: threadData, error: threadUpdateError } = await supabase
      .from('chat_threads')
      .update({ unread_count: 0 })
      .eq('id', threadId)
      .select();
      
    if (threadUpdateError) {
      console.error("Error resetting unread count:", threadUpdateError);
    } else {
      console.log("Thread unread count reset successfully:", threadData);
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}
