
import { supabase } from '@/integrations/supabase/client';
import { ChatThread } from '@/types/mechanic';

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
