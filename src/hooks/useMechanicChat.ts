
import { useAuth } from '@/hooks/useAuth';
import { useChatState } from './chat/useChatState';
import { useChatRealtime } from './chat/useChatRealtime';
import { useChatOperations } from './chat/useChatOperations';

export function useMechanicChat(mechanicId: string, mechanicName: string) {
  const { user, isLoggedIn, currentUserRole } = useAuth();
  
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    setChatMessages,
    threadId,
    setThreadId,
    isLoading,
    setIsLoading,
  } = useChatState();

  // For testing - get user ID from localStorage if Supabase user is not available
  const getUserId = () => {
    return user?.id || localStorage.getItem('userId') || 'anonymous';
  };
  
  const getUserName = () => {
    return user?.user_metadata?.full_name || 
           user?.email || 
           localStorage.getItem('userName') || 
           'Customer';
  };
  
  const currentUserId = getUserId();
  const currentUserName = getUserName();

  const {
    refreshMessages,
    openChat,
    handleSendMessage,
  } = useChatOperations({
    currentUserId,
    currentUserName,
    threadId,
    setThreadId,
    setIsLoading,
    setIsChatOpen,
    setChatMessages,
  });

  useChatRealtime({ threadId, setChatMessages });

  const handleOpenChat = () => openChat(mechanicId, mechanicName, isLoggedIn, currentUserRole || '');
  const handleSendMessageWithMechanic = (content: string) => handleSendMessage(content, mechanicId, mechanicName);

  return {
    isChatOpen,
    chatMessages,
    isLoading,
    openChat: handleOpenChat,
    closeChat: () => setIsChatOpen(false),
    handleSendMessage: handleSendMessageWithMechanic,
    refreshMessages,
    threadId,
  };
}
