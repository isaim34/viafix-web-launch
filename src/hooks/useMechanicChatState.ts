
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getChatThreads } from '@/services/chat/threadService';
import { ChatThread } from '@/types/mechanic';
import { toast } from 'sonner';

export function useMechanicChatState(initialThreadId?: string) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreadId || null);
  const [showChatOnMobile, setShowChatOnMobile] = useState(!!initialThreadId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, currentUserRole, currentUserName } = useAuth();
  const currentUserId = user?.id || 'anonymous';
  const userName = currentUserName || 'User';
  
  console.log('useMechanicChatState hook initialized with user:', { 
    userId: currentUserId, 
    userRole: currentUserRole,
    userName: userName,
    initialThreadId
  });
  
  const loadThreads = useCallback(async () => {
    if (!currentUserId || currentUserId === 'anonymous') {
      console.warn('User ID is not available, skipping thread loading');
      setThreads([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading chat threads for user:', currentUserId);
      const userThreads = await getChatThreads(currentUserId);
      console.log('Loaded threads:', userThreads);
      setThreads(userThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      setError("Failed to load chat threads. Please try again later.");
      toast.error("Error loading messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);
  
  useEffect(() => {
    // Only load threads if we have a valid user ID
    if (user?.id) {
      console.log('User detected, loading threads');
      loadThreads();
    } else {
      console.log('No user detected, not loading threads');
      setIsLoading(false);
    }
  }, [user, loadThreads]);
  
  useEffect(() => {
    // Set initial thread if provided and threads are loaded
    if (initialThreadId && threads.length > 0) {
      const threadExists = threads.some(thread => thread.id === initialThreadId);
      if (threadExists) {
        setSelectedThreadId(initialThreadId);
        setShowChatOnMobile(true);
      } else {
        console.warn(`Thread with ID ${initialThreadId} not found in loaded threads`);
      }
    }
  }, [initialThreadId, threads]);
  
  const handleSelectThread = (threadId: string) => {
    console.log('Thread selected:', threadId);
    setSelectedThreadId(threadId);
    setShowChatOnMobile(true);
  };
  
  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };
  
  const handleNewMessage = useCallback(() => {
    // Reload threads to update last message and unread count
    loadThreads();
  }, [loadThreads]);
  
  const selectedThread = threads.find(t => t.id === selectedThreadId);
  
  return {
    threads,
    selectedThread,
    selectedThreadId,
    showChatOnMobile,
    isLoading,
    error,
    currentUserId,
    currentUserRole,
    userName,
    handleSelectThread,
    handleBackToList,
    handleNewMessage,
    loadThreads
  };
}
