
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatThread } from '@/types/mechanic';
import { v4 as uuidv4 } from 'uuid';

// Get all chat threads for a user
export const getChatThreads = async (userId: string): Promise<ChatThread[]> => {
  try {
    const { data: threads, error } = await supabase
      .from('chat_threads')
      .select('*')
      .filter('participants', 'cs', `{${userId}}`)
      .order('last_message_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching chat threads:', error);
      return [];
    }
    
    // Transform the data to match our ChatThread type
    return (threads || []).map(thread => ({
      id: thread.id,
      participants: thread.participants,
      participantNames: thread.participant_names as Record<string, string>,
      lastMessage: null,
      unreadCount: thread.unread_count || 0,
      lastMessageAt: thread.last_message_at
    }));
  } catch (error) {
    console.error('Error retrieving chat threads:', error);
    return [];
  }
};

// Get a specific chat thread
export const getChatThread = async (threadId: string): Promise<ChatThread | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_threads')
      .select('*')
      .eq('id', threadId)
      .single();
    
    if (error) {
      console.error('Error fetching chat thread:', error);
      return null;
    }
    
    // Transform the data to match our ChatThread type
    return {
      id: data.id,
      participants: data.participants,
      participantNames: data.participant_names as Record<string, string>,
      lastMessage: null,
      unreadCount: data.unread_count || 0,
      lastMessageAt: data.last_message_at
    };
  } catch (error) {
    console.error('Error retrieving chat thread:', error);
    return null;
  }
};

// Find or create a thread between two users
export const findOrCreateChatThread = async (
  userId1: string, 
  userName1: string,
  userId2: string,
  userName2: string
): Promise<ChatThread> => {
  // Try to find an existing thread
  const { data: existingThreads, error: findError } = await supabase
    .from('chat_threads')
    .select('*')
    .contains('participants', [userId1, userId2])
    .filter('participants', 'cs', `{${userId1}}`)
    .filter('participants', 'cs', `{${userId2}}`)
    .limit(1);
  
  if (findError) {
    console.error('Error finding chat thread:', findError);
  }
  
  if (existingThreads && existingThreads.length > 0) {
    // Transform the data to match our ChatThread type
    return {
      id: existingThreads[0].id,
      participants: existingThreads[0].participants,
      participantNames: existingThreads[0].participant_names as Record<string, string>,
      lastMessage: null,
      unreadCount: existingThreads[0].unread_count || 0,
      lastMessageAt: existingThreads[0].last_message_at
    };
  }
  
  // Create a new thread
  const newThread = {
    participants: [userId1, userId2],
    participant_names: {
      [userId1]: userName1,
      [userId2]: userName2
    },
    last_message_at: new Date().toISOString(),
    unread_count: 0
  };
  
  const { data: createdThread, error: createError } = await supabase
    .from('chat_threads')
    .insert(newThread)
    .select()
    .single();
  
  if (createError) {
    console.error('Error creating chat thread:', createError);
    throw new Error('Failed to create chat thread');
  }
  
  // Transform the data to match our ChatThread type
  return {
    id: createdThread.id,
    participants: createdThread.participants,
    participantNames: createdThread.participant_names as Record<string, string>,
    lastMessage: null,
    unreadCount: createdThread.unread_count || 0,
    lastMessageAt: createdThread.last_message_at
  };
};

// Get messages for a thread
export const getChatMessages = async (threadId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
    
    // Transform the data to match our ChatMessage type
    return (data || []).map(msg => ({
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
    return [];
  }
};

// Send a new message
export const sendChatMessage = async (
  threadId: string, 
  message: Omit<ChatMessage, 'id'>
): Promise<ChatMessage> => {
  try {
    // Save the message
    const { data: newMessage, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: threadId,
        sender_id: message.senderId,
        sender_name: message.senderName,
        receiver_id: message.receiverId,
        content: message.content,
        timestamp: new Date().toISOString(),
        is_read: false
      })
      .select()
      .single();
    
    if (messageError) {
      console.error('Error sending chat message:', messageError);
      throw new Error('Failed to send message');
    }
    
    // Update thread's last message and unread count
    // This approach avoids the direct usage of supabase.rpc
    const { error: threadError } = await supabase
      .from('chat_threads')
      .update({
        last_message_at: new Date().toISOString(),
        unread_count: (thread => (thread?.unread_count || 0) + 1)
      })
      .eq('id', threadId);
    
    if (threadError) {
      console.error('Error updating chat thread:', threadError);
    }
    
    // Transform the data to match our ChatMessage type
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
    throw new Error('Failed to send message');
  }
};

// Mark messages as read
export const markThreadAsRead = async (threadId: string, userId: string): Promise<void> => {
  try {
    // Update thread unread count
    const { error: threadError } = await supabase
      .from('chat_threads')
      .update({ unread_count: 0 })
      .eq('id', threadId);
    
    if (threadError) {
      console.error('Error updating thread read status:', threadError);
    }
    
    // Mark messages as read
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('thread_id', threadId)
      .eq('receiver_id', userId);
    
    if (messagesError) {
      console.error('Error updating message read status:', messagesError);
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
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
          )
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
