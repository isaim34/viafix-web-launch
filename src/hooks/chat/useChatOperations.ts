
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/mechanic';
import { findOrCreateChatThread } from '@/services/chat/threadService';
import { sendChatMessage, getChatMessages } from '@/services/chat/messageService';

interface UseChatOperationsProps {
  currentUserId: string;
  currentUserName: string;
  threadId: string | null;
  setThreadId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function useChatOperations({
  currentUserId,
  currentUserName,
  threadId,
  setThreadId,
  setIsLoading,
  setIsChatOpen,
  setChatMessages,
}: UseChatOperationsProps) {
  const { toast } = useToast();

  const refreshMessages = useCallback(async () => {
    if (threadId) {
      try {
        console.log(`Refreshing messages for thread ${threadId}`);
        const messages = await getChatMessages(threadId);
        setChatMessages(messages);
      } catch (error) {
        console.error('Error refreshing chat messages:', error);
      }
    }
  }, [threadId, setChatMessages]);

  const openChat = useCallback(async (mechanicId: string, mechanicName: string, isLoggedIn: boolean, currentUserRole: string) => {
    const isCustomerLoggedIn = isLoggedIn && currentUserRole === 'customer';
    
    if (!isCustomerLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start a chat with this mechanic.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`Opening chat between ${currentUserName} (${currentUserId}) and ${mechanicName} (${mechanicId})`);
      
      if (!currentUserId || currentUserId === 'anonymous') {
        throw new Error("User not authenticated - no user ID found");
      }
      
      const thread = await findOrCreateChatThread(
        currentUserId,
        currentUserName,
        mechanicId,
        mechanicName
      );
      
      console.log('Chat thread found/created:', thread);
      setThreadId(thread.id);
      
      const messages = await getChatMessages(thread.id);
      console.log('Chat messages loaded:', messages);
      setChatMessages(messages);
      setIsChatOpen(true);
    } catch (error) {
      console.error('Error opening chat:', error);
      toast({
        title: "Error",
        description: "Failed to open chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, currentUserName, setIsLoading, setThreadId, setChatMessages, setIsChatOpen, toast]);

  const handleSendMessage = useCallback(async (content: string, mechanicId: string, mechanicName: string) => {
    console.log(`Attempting to send message: ${content}`);
    
    if (!threadId) {
      toast({
        title: "Error",
        description: "Cannot send message. Chat session not initialized.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentUserId || currentUserId === 'anonymous') {
      toast({
        title: "Authentication required",
        description: "You must be signed in to send messages.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log(`Sending message in thread ${threadId}: ${content}`);
      
      const newMessage = await sendChatMessage(threadId, {
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: mechanicId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
      });
      
      console.log('Message sent successfully:', newMessage);
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${mechanicName}.`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }, [threadId, currentUserId, currentUserName, toast]);

  return {
    refreshMessages,
    openChat,
    handleSendMessage,
  };
}
