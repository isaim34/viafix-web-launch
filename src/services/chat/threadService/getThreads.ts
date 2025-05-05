
import { supabase } from '@/integrations/supabase/client';
import { ChatThread } from '@/types/mechanic';

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
