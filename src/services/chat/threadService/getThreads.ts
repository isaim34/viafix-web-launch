
import { supabase } from '@/integrations/supabase/client';
import { ChatThread } from '@/types/mechanic';

/**
 * Get all chat threads for a user
 */
export async function getChatThreads(userId: string): Promise<ChatThread[]> {
  console.log(`Getting chat threads for user ${userId}`);
  try {
    if (!userId || userId === 'anonymous') {
      console.warn('Invalid user ID provided to getChatThreads');
      return [];
    }
    
    // Query for threads where user is a participant
    const { data: threads, error } = await supabase
      .from('chat_threads')
      .select('*')
      .filter('participants', 'cs', `{${userId}}`)
      .order('last_message_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching chat threads:', error);
      throw error;
    }
    
    if (!threads || threads.length === 0) {
      console.log(`No threads found for user ${userId}`);
      return [];
    }
    
    console.log(`Found ${threads.length} threads for user ${userId}`);
    
    // Convert to ChatThread format
    return threads.map(thread => {
      // Process participant names
      let participantNames: Record<string, string> = {};
      
      try {
        // Handle JSON string or object
        if (typeof thread.participant_names === 'string') {
          participantNames = JSON.parse(thread.participant_names);
        } else if (thread.participant_names && typeof thread.participant_names === 'object') {
          Object.assign(participantNames, thread.participant_names);
        } else {
          console.warn(`Invalid participant_names format for thread ${thread.id}:`, thread.participant_names);
          // Create default names as fallback
          thread.participants.forEach((participantId: string) => {
            participantNames[participantId] = participantId === userId ? 'You' : 'User';
          });
        }
      } catch (e) {
        console.error(`Error parsing participant names in thread ${thread.id}:`, e);
        // Create default names if parsing fails
        thread.participants.forEach((participantId: string) => {
          participantNames[participantId] = participantId === userId ? 'You' : 'User';
        });
      }
      
      // Ensure last_message_at is valid
      const lastMessageAt = thread.last_message_at 
        ? new Date(thread.last_message_at).toISOString() 
        : new Date().toISOString();
      
      // Create the ChatThread object
      return {
        id: thread.id,
        participants: Array.isArray(thread.participants) ? thread.participants : [],
        participantNames: participantNames,
        lastMessageAt: lastMessageAt,
        unreadCount: typeof thread.unread_count === 'number' ? thread.unread_count : 0
      };
    });
  } catch (error) {
    console.error('Error getting chat threads:', error);
    return []; // Return empty array on error
  }
}
