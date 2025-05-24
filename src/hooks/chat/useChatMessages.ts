
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/mechanic';
import { getChatMessages, sendChatMessage, markMessagesAsRead } from '@/services/chat';
import { toast } from 'sonner';

interface UseChatMessagesProps {
  threadId: string;
  currentUserId: string;
  onNewMessage: (threadId: string) => void;
}

export function useChatMessages({ threadId, currentUserId, onNewMessage }: UseChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading messages for thread ${threadId}`);
      const chatMessages = await getChatMessages(threadId);
      console.log('Messages loaded:', chatMessages);
      setMessages(chatMessages);
      
      // Mark messages as read
      if (chatMessages.length > 0) {
        await markMessagesAsRead(threadId, currentUserId);
      }
      
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages. Please try again.");
      toast.error("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [threadId, currentUserId]);

  const handleSendMessage = useCallback(async (messageText: string, otherParticipantId: string, participantNames: Record<string, string>) => {
    if (!messageText.trim()) {
      toast.error("Cannot send empty message");
      return;
    }
    
    try {
      setIsSending(true);
      console.log(`Sending message in thread ${threadId}: ${messageText}`);
      
      // Get the current user name from localStorage or thread data
      const currentUserName = participantNames[currentUserId] || localStorage.getItem('userName') || 'Me';
      
      // Send message
      const newMessageData = {
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: otherParticipantId,
        content: messageText,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      console.log('Preparing to send message with data:', newMessageData);
      
      const newMessage = await sendChatMessage(threadId, newMessageData);
      console.log('Message sent successfully:', newMessage);
      
      // Don't update local state here - let the real-time subscription handle it
      // This prevents duplicates when the subscription receives the same message
      
      // Notify parent
      onNewMessage(threadId);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [threadId, currentUserId, onNewMessage]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      const messageExists = prev.some(msg => msg.id === message.id);
      if (messageExists) {
        console.log('Message already exists in ChatView, skipping duplicate:', message.id);
        return prev;
      }
      console.log('Adding new message to ChatView:', message.id);
      return [...prev, message];
    });
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    error,
    loadMessages,
    handleSendMessage,
    addMessage,
    setError
  };
}
