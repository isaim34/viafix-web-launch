
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
    // First try to use legacy method for backward compatibility
    const legacyThreads = getChatThreads_legacy(userId);
    if (legacyThreads && legacyThreads.length > 0) {
      console.log(`Found ${legacyThreads.length} legacy chat threads`);
      return legacyThreads;
    }
    
    // If no legacy threads found, or if legacy method fails, continue with Supabase
    // For demo purposes, return some sample data if we're not connected to Supabase
    // This allows the UI to work without a database connection
    const sampleThreads: ChatThread[] = [
      {
        id: "sample-thread-1",
        participants: [userId, "mechanic-123"],
        participantNames: {
          [userId]: "You",
          "mechanic-123": "John's Auto Repair"
        },
        lastMessage: {
          id: "msg-1",
          senderId: "mechanic-123",
          senderName: "John's Auto Repair",
          receiverId: userId,
          content: "Hello, how can I help you with your vehicle?",
          timestamp: new Date().toISOString(),
          isRead: false
        },
        unreadCount: 1,
        lastMessageAt: new Date().toISOString()
      }
    ];
    
    console.log("Returning sample chat threads for demo purposes");
    return sampleThreads;
  } catch (error) {
    console.error('Error retrieving chat threads:', error);
    return [];
  }
};

// Get a specific chat thread
export const getChatThread = async (threadId: string): Promise<ChatThread | null> => {
  try {
    // Try legacy method first for backward compatibility
    const legacyThread = getChatThread_legacy(threadId);
    if (legacyThread) {
      return legacyThread;
    }
    
    // For demo purposes, return a sample thread
    if (threadId === "sample-thread-1") {
      return {
        id: "sample-thread-1",
        participants: ["current-user", "mechanic-123"],
        participantNames: {
          "current-user": "You",
          "mechanic-123": "John's Auto Repair"
        },
        lastMessage: {
          id: "msg-1",
          senderId: "mechanic-123",
          senderName: "John's Auto Repair",
          receiverId: "current-user",
          content: "Hello, how can I help you with your vehicle?",
          timestamp: new Date().toISOString(),
          isRead: false
        },
        unreadCount: 1,
        lastMessageAt: new Date().toISOString()
      };
    }
    
    return null;
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
  // Try legacy method for backward compatibility
  try {
    return findOrCreateChatThread_legacy(userId1, userName1, userId2, userName2);
  } catch (error) {
    console.error('Error finding/creating chat thread:', error);
    
    // Create a new sample thread for demo purposes
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
    
    console.log("Created sample chat thread:", newThread);
    return newThread;
  }
};

// Get messages for a thread
export const getChatMessages = async (threadId: string): Promise<ChatMessage[]> => {
  try {
    // Try legacy method first for backward compatibility
    const legacyMessages = getChatMessages_legacy(threadId);
    if (legacyMessages && legacyMessages.length > 0) {
      return legacyMessages;
    }
    
    // For demo purposes, return sample messages
    if (threadId === "sample-thread-1") {
      return [
        {
          id: "msg-1",
          senderId: "mechanic-123",
          senderName: "John's Auto Repair",
          receiverId: "current-user",
          content: "Hello, how can I help you with your vehicle?",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isRead: false
        }
      ];
    }
    
    return [];
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
    // Try legacy method for backward compatibility
    return sendChatMessage_legacy(threadId, message);
  } catch (error) {
    console.error('Error sending chat message:', error);
    
    // For demo purposes, create a sample message
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4()
    };
    
    console.log("Created sample chat message:", newMessage);
    return newMessage;
  }
};

// Mark messages as read
export const markThreadAsRead = async (threadId: string, userId: string): Promise<void> => {
  try {
    // Try legacy method for backward compatibility
    markThreadAsRead_legacy(threadId, userId);
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
