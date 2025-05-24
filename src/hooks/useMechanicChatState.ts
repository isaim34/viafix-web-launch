
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
  
  // Enhanced user ID retrieval with debugging
  const getCurrentUserId = () => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    
    console.log('useMechanicChatState - User ID sources:', {
      supabaseUserId,
      localStorageUserId,
      currentUserRole
    });
    
    // For test accounts, prefer localStorage ID, otherwise use Supabase user ID
    const finalUserId = localStorageUserId || supabaseUserId || 'anonymous';
    
    console.log('useMechanicChatState - Final user ID selected:', finalUserId);
    return finalUserId;
  };

  const currentUserId = getCurrentUserId();
  const userName = currentUserName || 'User';
  
  console.log('useMechanicChatState hook initialized with user:', { 
    userId: currentUserId, 
    userRole: currentUserRole,
    userName: userName,
    initialThreadId
  });
  
  const loadThreads = useCallback(async () => {
    if (!currentUserId || currentUserId === 'anonymous') {
      console.warn('useMechanicChatState - User ID is not available, skipping thread loading');
      setThreads([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('useMechanicChatState - Loading chat threads for user:', currentUserId);
      const userThreads = await getChatThreads(currentUserId);
      console.log('useMechanicChatState - Loaded threads:', userThreads);
      setThreads(userThreads);
    } catch (error) {
      console.error("useMechanicChatState - Error loading threads:", error);
      setError("Failed to load chat threads. Please try again later.");
      toast.error("Error loading messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);
  
  useEffect(() => {
    // Only load threads if we have a valid user ID
    if (currentUserId && currentUserId !== 'anonymous') {
      console.log('useMechanicChatState - Valid user detected, loading threads');
      loadThreads();
    } else {
      console.log('useMechanicChatState - No valid user detected, not loading threads');
      setIsLoading(false);
    }
  }, [currentUserId, loadThreads]);
  
  useEffect(() => {
    // Set initial thread if provided and threads are loaded
    if (initialThreadId && threads.length > 0) {
      const threadExists = threads.some(thread => thread.id === initialThreadId);
      if (threadExists) {
        setSelectedThreadId(initialThreadId);
        setShowChatOnMobile(true);
      } else {
        console.warn(`useMechanicChatState - Thread with ID ${initialThreadId} not found in loaded threads`);
      }
    }
  }, [initialThreadId, threads]);
  
  const handleSelectThread = (threadId: string) => {
    console.log('useMechanicChatState - Thread selected:', threadId);
    setSelectedThreadId(threadId);
    setShowChatOnMobile(true);
  };
  
  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };
  
  const handleNewMessage = useCallback(() => {
    // Reload threads to update last message and unread count
    console.log('useMechanicChatState - New message received, reloading threads');
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
