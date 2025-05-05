import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatThread } from '@/types/mechanic';
import { v4 as uuidv4 } from 'uuid';

// Get all chat threads for a user
export const getChatThreads = async (userId: string): Promise<ChatThread[]> => {
  if (!userId || userId === 'anonymous') {
    console.error("Cannot fetch chat threads: No valid user ID provided");
    return [];
  }
  
  console.log(`Fetching chat threads for user: ${userId}`);
  
  try {
    // Fetch threads from Supabase where the user is a participant
    const { data: threads, error } = await supabase
      .from('chat_threads')
      .select('*')
      .contains('participants', [userId]);
      
    if (error) {
      console.error("Error fetching chat threads from Supabase:", error);
      // Try legacy method as fallback
      return getChatThreads_legacy(userId);
    }
    
    if (!threads || threads.length === 0) {
      console.log("No threads found in database, trying legacy storage");
      return getChatThreads_legacy(userId);
    }
    
    console.log(`Found ${threads.length} threads in Supabase`);
    
    // Format and return the threads
    return threads.map(thread => ({
      id: thread.id,
      participants: thread.participants,
      participantNames: thread.participant_names,
      lastMessage: null, // We'll fetch this separately
      unreadCount: thread.unread_count || 0,
      lastMessageAt: thread.last_message_at || thread.created_at
    }));
  } catch (error) {
    console.error('Error retrieving chat threads:', error);
    // Fallback to legacy method
    return getChatThreads_legacy(userId);
  }
};

// Get a specific chat thread
export const getChatThread = async (threadId: string): Promise<ChatThread | null> => {
  try {
    // Get thread from Supabase
    const { data: thread, error } = await supabase
      .from('chat_threads')
      .select('*')
      .eq('id', threadId)
      .single();
      
    if (error) {
      console.error("Error fetching chat thread from Supabase:", error);
      // Try legacy method
      return getChatThread_legacy(threadId);
    }
    
    if (!thread) {
      console.log("No thread found in database, trying legacy storage");
      return getChatThread_legacy(threadId);
    }
    
    return {
      id: thread.id,
      participants: thread.participants,
      participantNames: thread.participant_names,
      lastMessage: null, // We'll fetch this separately
      unreadCount: thread.unread_count || 0,
      lastMessageAt: thread.last_message_at || thread.created_at
    };
  } catch (error) {
    console.error('Error retrieving chat thread:', error);
    // Fallback to legacy method
    return getChatThread_legacy(threadId);
  }
};

// Find or create a thread between two users
export const findOrCreateChatThread = async (
  userId1: string, 
  userName1: string,
  userId2: string,
  userName2: string
): Promise<ChatThread> => {
  console.log(`Finding or creating chat thread between ${userName1}(${userId1}) and ${userName2}(${userId2})`);
  
  try {
    // Try to find an existing thread with both participants
    const { data: existingThreads, error: searchError } = await supabase
      .from('chat_threads')
      .select('*')
      .contains('participants', [userId1, userId2]);
      
    if (searchError) {
      console.error("Error searching for existing thread:", searchError);
      throw searchError;
    }
    
    // Check if we found an exact match (exactly these two participants)
    const exactMatch = existingThreads?.find(thread => 
      thread.participants.length === 2 && 
      thread.participants.includes(userId1) && 
      thread.participants.includes(userId2)
    );
    
    if (exactMatch) {
      console.log("Found existing thread:", exactMatch.id);
      return {
        id: exactMatch.id,
        participants: exactMatch.participants,
        participantNames: exactMatch.participant_names,
        lastMessage: null,
        unreadCount: exactMatch.unread_count || 0,
        lastMessageAt: exactMatch.last_message_at || exactMatch.created_at
      };
    }
    
    // If no thread exists, create a new one
    console.log("No existing thread found, creating new thread");
    
    // Prepare the participant names object
    const participantNames: Record<string, string> = {};
    participantNames[userId1] = userName1;
    participantNames[userId2] = userName2;
    
    // Create new thread
    const { data: newThread, error: createError } = await supabase
      .from('chat_threads')
      .insert({
        participants: [userId1, userId2],
        participant_names: participantNames,
        last_message_at: new Date().toISOString(),
        unread_count: 0
      })
      .select()
      .single();
      
    if (createError) {
      console.error("Error creating new thread:", createError);
      throw createError;
    }
    
    if (!newThread) {
      throw new Error("Failed to create new thread");
    }
    
    console.log("Created new thread:", newThread.id);
    
    // Return the newly created thread
    return {
      id: newThread.id,
      participants: newThread.participants,
      participantNames: newThread.participant_names,
      lastMessage: null,
      unreadCount: 0,
      lastMessageAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in findOrCreateChatThread:', error);
    // Fallback to legacy method
    return findOrCreateChatThread_legacy(userId1, userName1, userId2, userName2);
  }
};

// Get messages for a thread
export const getChatMessages = async (threadId: string): Promise<ChatMessage[]> => {
  try {
    console.log(`Fetching messages for thread: ${threadId}`);
    
    // Get messages from Supabase
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('timestamp', { ascending: true });
      
    if (error) {
      console.error("Error fetching messages from Supabase:", error);
      // Fallback to legacy
      return getChatMessages_legacy(threadId);
    }
    
    if (!messages || messages.length === 0) {
      console.log("No messages found in database, trying legacy storage");
      return getChatMessages_legacy(threadId);
    }
    
    console.log(`Found ${messages.length} messages in Supabase`);
    
    // Format and return the messages
    return messages.map(msg => ({
      id: msg.id,
      senderId: msg.sender_id,
      senderName: msg.sender_name,
      receiverId: msg.receiver_id,
      content: msg.content,
      timestamp: msg.timestamp,
      isRead: msg.is_read
    }));
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    // Fallback to legacy method
    return getChatMessages_legacy(threadId);
  }
};

// Send a new message
export const sendChatMessage = async (
  threadId: string, 
  message: Omit<ChatMessage, 'id'>
): Promise<ChatMessage> => {
  try {
    console.log(`Sending message to thread ${threadId}:`, message);
    
    // Create message in Supabase
    const { data: newMessage, error } = await supabase
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
      
    if (error) {
      console.error("Error sending message to Supabase:", error);
      throw error;
    }
    
    if (!newMessage) {
      throw new Error("Failed to create message");
    }
    
    console.log("Message sent successfully with ID:", newMessage.id);
    
    // Update the thread's lastMessage and lastMessageAt
    await supabase
      .from('chat_threads')
      .update({
        last_message_at: new Date().toISOString(),
        unread_count: supabase.rpc('increment_unread_count', { thread_id: threadId })
      })
      .eq('id', threadId);
      
    // Return the created message
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
    // Fallback to legacy method
    return sendChatMessage_legacy(threadId, message);
  }
};

// Mark messages as read
export const markThreadAsRead = async (threadId: string, userId: string): Promise<void> => {
  try {
    console.log(`Marking messages as read for thread ${threadId} and user ${userId}`);
    
    // Update all unread messages for this user in this thread
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('thread_id', threadId)
      .eq('receiver_id', userId)
      .eq('is_read', false);
      
    // Reset unread count for the thread
    await supabase
      .from('chat_threads')
      .update({ unread_count: 0 })
      .eq('id', threadId);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    // Fallback to legacy method
    markThreadAsRead_legacy(threadId, userId);
  }
};

// Initialize with some sample data if none exists (for demo purposes)
export const initializeSampleChats = async (): Promise<void> => {
  // This function is now a no-op since we're using Supabase
  // All data will be stored in the database
};

// Legacy functions to maintain compatibility with existing codebase
// These should be migrated away from in future updates
export const getChatThreads_legacy = (userId: string): ChatThread[] => {
  try {
    const storedChats = localStorage.getItem('mechanic_app_chats');
    if (!storedChats) return [];
    
    const threads = JSON.parse(storedChats) as ChatThread[];
    return threads.filter(thread => thread.participants.includes(userId));
  } catch (error) {
    console.error('Error retrieving chat threads:', error);
    return [];
  }
};

export const getChatThread_legacy = (threadId: string): ChatThread | null => {
  try {
    const storedChats = localStorage.getItem('mechanic_app_chats');
    if (!storedChats) return null;
    
    const threads = JSON.parse(storedChats) as ChatThread[];
    return threads.find(thread => thread.id === threadId) || null;
  } catch (error) {
    console.error('Error retrieving chat thread:', error);
    return null;
  }
};

export const findOrCreateChatThread_legacy = (
  userId1: string, 
  userName1: string,
  userId2: string,
  userName2: string
): ChatThread => {
  const allThreads = getChatThreads_legacy('all');
  
  // Try to find an existing thread
  const existingThread = allThreads.find(thread => {
    const hasUser1 = thread.participants.includes(userId1);
    const hasUser2 = thread.participants.includes(userId2);
    return hasUser1 && hasUser2 && thread.participants.length === 2;
  });
  
  if (existingThread) {
    return existingThread;
  }
  
  // Create a new thread
  const newThread: ChatThread = {
    id: uuidv4(),
    participants: [userId1, userId2],
    participantNames: {
      [userId1]: userName1,
      [userId2]: userName2
    },
    unreadCount: 0,
    lastMessage: null,
    lastMessageAt: new Date().toISOString()
  };
  
  // Save the new thread
  const updatedThreads = [...allThreads, newThread];
  localStorage.setItem('mechanic_app_chats', JSON.stringify(updatedThreads));
  
  return newThread;
};

export const getChatMessages_legacy = (threadId: string): ChatMessage[] => {
  try {
    const key = `mechanic_app_chats_messages_${threadId}`;
    const storedMessages = localStorage.getItem(key);
    if (!storedMessages) return [];
    
    return JSON.parse(storedMessages) as ChatMessage[];
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    return [];
  }
};

export const sendChatMessage_legacy = (
  threadId: string, 
  message: Omit<ChatMessage, 'id'>
): ChatMessage => {
  const newMessage: ChatMessage = {
    ...message,
    id: uuidv4()
  };
  
  try {
    // Save the message
    const key = `mechanic_app_chats_messages_${threadId}`;
    const existingMessages = getChatMessages_legacy(threadId);
    const updatedMessages = [...existingMessages, newMessage];
    localStorage.setItem(key, JSON.stringify(updatedMessages));
    
    // Update the thread's last message and unread count
    const allThreads = getChatThreads_legacy('all');
    const updatedThreads = allThreads.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          lastMessage: newMessage,
          unreadCount: thread.unreadCount + (
            thread.participants.find(p => p !== message.senderId) ? 1 : 0
          ),
          lastMessageAt: new Date().toISOString()
        };
      }
      return thread;
    });
    
    localStorage.setItem('mechanic_app_chats', JSON.stringify(updatedThreads));
    
    return newMessage;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message');
  }
};

export const markThreadAsRead_legacy = (threadId: string, userId: string): void => {
  try {
    // Update thread unread count
    const allThreads = getChatThreads_legacy('all');
    const updatedThreads = allThreads.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          unreadCount: 0
        };
      }
      return thread;
    });
    
    localStorage.setItem('mechanic_app_chats', JSON.stringify(updatedThreads));
    
    // Mark messages as read
    const key = `mechanic_app_chats_messages_${threadId}`;
    const existingMessages = getChatMessages_legacy(threadId);
    const updatedMessages = existingMessages.map(msg => {
      if (msg.receiverId === userId && !msg.isRead) {
        return {
          ...msg,
          isRead: true
        };
      }
      return msg;
    });
    
    localStorage.setItem(key, JSON.stringify(updatedMessages));
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};
