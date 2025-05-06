
import { supabase } from '@/integrations/supabase/client';
import { ChatThread, ChatMessage } from '@/types/mechanic';

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
    const threadPromises = threads.map(async (thread) => {
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
      
      // Get last message for the thread
      const { data: lastMessages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', thread.id)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (msgError) {
        console.error("Error fetching last message:", msgError);
      }
      
      // Format last message if available
      let lastMessage = null;
      if (lastMessages && lastMessages.length > 0) {
        const msg = lastMessages[0];
        lastMessage = {
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_name,
          receiverId: msg.receiver_id,
          content: msg.content,
          timestamp: msg.timestamp,
          isRead: msg.is_read
        };
      }
      
      // Create the ChatThread object
      return {
        id: thread.id,
        participants: thread.participants,
        participantNames: participantNames,
        lastMessage: lastMessage,
        lastMessageAt: thread.last_message_at,
        unreadCount: thread.unread_count || 0
      };
    });
    
    // Wait for all thread data to resolve
    return Promise.all(threadPromises);
  } catch (error) {
    console.error('Error getting chat threads:', error);
    return []; // Return empty array on error
  }
}
