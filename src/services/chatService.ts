
import { ChatMessage, ChatThread } from '@/types/mechanic';

// In a real app, this would interact with a backend/database
// For demo purposes, we'll use localStorage

const CHAT_STORAGE_KEY = 'mechanic_app_chats';

// Helper to get a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all chat threads
export const getChatThreads = (userId: string): ChatThread[] => {
  try {
    const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!storedChats) return [];
    
    const threads = JSON.parse(storedChats) as ChatThread[];
    return threads.filter(thread => thread.participants.includes(userId));
  } catch (error) {
    console.error('Error retrieving chat threads:', error);
    return [];
  }
};

// Get a specific chat thread
export const getChatThread = (threadId: string): ChatThread | null => {
  try {
    const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!storedChats) return null;
    
    const threads = JSON.parse(storedChats) as ChatThread[];
    return threads.find(thread => thread.id === threadId) || null;
  } catch (error) {
    console.error('Error retrieving chat thread:', error);
    return null;
  }
};

// Find or create a thread between two users
export const findOrCreateChatThread = (
  userId1: string, 
  userName1: string,
  userId2: string,
  userName2: string
): ChatThread => {
  const allThreads = getChatThreads('all');
  
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
    id: generateId(),
    participants: [userId1, userId2],
    participantNames: {
      [userId1]: userName1,
      [userId2]: userName2
    },
    unreadCount: 0
  };
  
  // Save the new thread
  const updatedThreads = [...allThreads, newThread];
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedThreads));
  
  return newThread;
};

// Get messages for a thread
export const getChatMessages = (threadId: string): ChatMessage[] => {
  try {
    const key = `${CHAT_STORAGE_KEY}_messages_${threadId}`;
    const storedMessages = localStorage.getItem(key);
    if (!storedMessages) return [];
    
    return JSON.parse(storedMessages) as ChatMessage[];
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    return [];
  }
};

// Send a new message
export const sendChatMessage = (
  threadId: string, 
  message: Omit<ChatMessage, 'id'>
): ChatMessage => {
  const newMessage: ChatMessage = {
    ...message,
    id: generateId()
  };
  
  try {
    // Save the message
    const key = `${CHAT_STORAGE_KEY}_messages_${threadId}`;
    const existingMessages = getChatMessages(threadId);
    const updatedMessages = [...existingMessages, newMessage];
    localStorage.setItem(key, JSON.stringify(updatedMessages));
    
    // Update the thread's last message and unread count
    const allThreads = getChatThreads('all');
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
    
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedThreads));
    
    return newMessage;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message');
  }
};

// Mark messages as read
export const markThreadAsRead = (threadId: string, userId: string): void => {
  try {
    // Update thread unread count
    const allThreads = getChatThreads('all');
    const updatedThreads = allThreads.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          unreadCount: 0
        };
      }
      return thread;
    });
    
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedThreads));
    
    // Mark messages as read
    const key = `${CHAT_STORAGE_KEY}_messages_${threadId}`;
    const existingMessages = getChatMessages(threadId);
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

// Initialize with some sample data if none exists
export const initializeSampleChats = (): void => {
  const existingChats = localStorage.getItem(CHAT_STORAGE_KEY);
  if (!existingChats) {
    // Sample empty array to start
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([]));
  }
};
