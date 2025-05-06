
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getChatThreads } from '@/services/chat/threadService';
import { ChatThread } from '@/types/mechanic';
import { useNavigate } from 'react-router-dom';

export function useMessagePage() {
  const { isLoggedIn, currentUserRole, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("chat");  // Default to "chat" for customers
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChatView, setShowChatView] = useState(false);
  const navigate = useNavigate();

  const currentUserId = user?.id || localStorage.getItem('userId') || 'anonymous';

  // Fetch chat threads when component mounts
  useEffect(() => {
    const fetchThreads = async () => {
      if (!isLoggedIn) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // For debugging
        console.log("Fetching threads for user:", currentUserId);
        
        const userThreads = await getChatThreads(currentUserId);
        console.log("Fetched threads:", userThreads);
        
        setThreads(userThreads);
      } catch (error) {
        console.error("Error fetching chat threads:", error);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchThreads();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, currentUserId]);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setShowChatView(true);
  };

  const handleBackToList = () => {
    setShowChatView(false);
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
