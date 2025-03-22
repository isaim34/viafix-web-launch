
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/mechanic';
import { findOrCreateChatThread, sendChatMessage, getChatMessages } from '@/services/chatService';

export function useMechanicChat(mechanicId: string, mechanicName: string, currentUserId: string, currentUserName: string) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  
  const openChat = () => {
    // Find or create a chat thread between customer and mechanic
    const threadId = findOrCreateChatThread(
      currentUserId,
      currentUserName,
      `mechanic-${mechanicId}`,
      mechanicName
    ).id;
    
    // Get messages for this thread
    const messages = getChatMessages(threadId);
    setChatMessages(messages);
    setIsChatOpen(true);
  };
  
  const handleSendMessage = (content: string) => {
    // Find or create thread
    const thread = findOrCreateChatThread(
      currentUserId,
      currentUserName,
      `mechanic-${mechanicId}`,
      mechanicName
    );
    
    // Send message
    const newMessage = sendChatMessage(thread.id, {
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId: `mechanic-${mechanicId}`,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    
    // Update local state
    setChatMessages(prev => [...prev, newMessage]);
    
    // Show toast for demo purposes
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${mechanicName}.`,
    });
  };

  return {
    isChatOpen,
    chatMessages,
    openChat,
    closeChat: () => setIsChatOpen(false),
    handleSendMessage,
  };
}
