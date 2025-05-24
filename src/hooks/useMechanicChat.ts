
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

  // Enhanced user ID retrieval with debugging for messaging
  const getUserId = () => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    
    console.log('useMechanicChat - User ID sources:', {
      supabaseUserId,
      localStorageUserId,
      mechanicId,
      currentUserRole
    });
    
    // For test accounts, prefer localStorage ID, otherwise use Supabase user ID
    const finalUserId = localStorageUserId || supabaseUserId || 'anonymous';
    
    console.log('useMechanicChat - Final user ID for chat:', finalUserId);
    return finalUserId;
  };
  
  const getUserName = () => {
    const authUserName = user?.user_metadata?.full_name || user?.email;
    const localStorageUserName = localStorage.getItem('userName');
    
    const finalUserName = localStorageUserName || authUserName || 'Customer';
    
    console.log('useMechanicChat - User name for chat:', finalUserName);
    return finalUserName;
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

  const handleOpenChat = () => {
    console.log('useMechanicChat - Opening chat with mechanic:', {
      mechanicId,
      mechanicName,
      currentUserId,
      currentUserName,
      isLoggedIn,
      currentUserRole
    });
    openChat(mechanicId, mechanicName, isLoggedIn, currentUserRole || '');
  };
  
  const handleSendMessageWithMechanic = (content: string) => {
    console.log('useMechanicChat - Sending message to mechanic:', {
      mechanicId,
      mechanicName,
      content,
      currentUserId
    });
    handleSendMessage(content, mechanicId, mechanicName);
  };

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
