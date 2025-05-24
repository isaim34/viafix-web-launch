
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { getChatThreads } from '@/services/chat/threadService';
import { ChatThread } from '@/types/mechanic';
import { useNavigate } from 'react-router-dom';

export function useMessagePage() {
  const { isLoggedIn, currentUserRole, user } = useAuth();
  const { refreshUnreadCount, markAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChatView, setShowChatView] = useState(false);
  const navigate = useNavigate();

  // Enhanced user ID retrieval with debugging
  const getCurrentUserId = () => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    
    console.log('useMessagePage - User ID sources:', {
      supabaseUserId,
      localStorageUserId,
      currentUserRole,
      isLoggedIn
    });
    
    // For test accounts, prefer localStorage ID, otherwise use Supabase user ID
    const finalUserId = localStorageUserId || supabaseUserId || 'anonymous';
    
    console.log('useMessagePage - Final user ID selected:', finalUserId);
    return finalUserId;
  };

  const currentUserId = getCurrentUserId();

  // Fetch chat threads when component mounts
  useEffect(() => {
    const fetchThreads = async () => {
      if (!isLoggedIn) {
        console.log('useMessagePage - User not logged in, skipping thread fetch');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // For debugging
        console.log("useMessagePage - Fetching threads for user:", {
          userId: currentUserId,
          role: currentUserRole,
          isLoggedIn
        });
        
        const userThreads = await getChatThreads(currentUserId);
        console.log("useMessagePage - Fetched threads:", userThreads);
        
        setThreads(userThreads);
        
        // Refresh global unread count
        refreshUnreadCount();
      } catch (error) {
        console.error("useMessagePage - Error fetching chat threads:", error);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && currentUserId && currentUserId !== 'anonymous') {
      fetchThreads();
    } else {
      console.log('useMessagePage - Conditions not met for fetching threads:', {
        isLoggedIn,
        currentUserId,
        hasValidUserId: currentUserId !== 'anonymous'
      });
      setIsLoading(false);
    }
  }, [isLoggedIn, currentUserId, currentUserRole, refreshUnreadCount]);

  const handleSelectThread = (threadId: string) => {
    console.log('useMessagePage - Thread selected:', threadId);
    setSelectedThreadId(threadId);
    setShowChatView(true);
    
    // Find the selected thread and mark as read if it has unread messages
    const selectedThread = threads.find(t => t.id === threadId);
    if (selectedThread && selectedThread.unreadCount > 0) {
      console.log('useMessagePage - Marking selected thread as read:', threadId);
      markAsRead(threadId);
    }
  };

  const handleBackToList = () => {
    setShowChatView(false);
    // Refresh threads to get updated unread counts
    if (isLoggedIn && currentUserId && currentUserId !== 'anonymous') {
      getChatThreads(currentUserId).then(userThreads => {
        setThreads(userThreads);
        refreshUnreadCount();
      });
    }
  };

  const handleSignInClick = () => {
    navigate('/signin', { state: { redirectTo: '/messages' } });
  };

  return {
    isLoggedIn,
    currentUserRole,
    currentUserId,
    activeTab,
    setActiveTab,
    threads,
    selectedThreadId,
    showChatView,
    isLoading,
    error,
    handleSelectThread,
    handleBackToList,
    handleSignInClick
  };
}
