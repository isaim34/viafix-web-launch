
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/mechanic';
import { findOrCreateChatThread, sendChatMessage, getChatMessages } from '@/services/chat';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useMechanicChat(mechanicId: string, mechanicName: string) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isLoggedIn, currentUserRole } = useAuth();
  
  const currentUserId = user?.id || 'anonymous';
  const currentUserName = user?.user_metadata?.full_name || user?.email || 'Customer';
  
  // Function to refresh messages
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
  }, [threadId]);
  
  useEffect(() => {
    // Set up real-time updates for chat messages
    if (threadId) {
      console.log(`Setting up realtime subscription for thread ${threadId}`);
      
      const channel = supabase
        .channel(`chat_messages_${threadId}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'chat_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('New chat message received:', payload);
            const newMessage = payload.new as any;
            
            // Only add the message if it's not from the current user or not already in the list
            if (newMessage.sender_id !== currentUserId || 
                !chatMessages.some(msg => msg.id === newMessage.id)) {
              const formattedMessage: ChatMessage = {
                id: newMessage.id,
                senderId: newMessage.sender_id,
                senderName: newMessage.sender_name,
                receiverId: newMessage.receiver_id,
                content: newMessage.content,
                timestamp: newMessage.timestamp,
                isRead: newMessage.is_read
              };
              setChatMessages(prev => [...prev, formattedMessage]);
            }
          }
        )
        .subscribe();
        
      console.log(`Subscribed to chat messages for thread ${threadId}`);
        
      return () => {
        console.log(`Unsubscribing from chat messages for thread ${threadId}`);
        supabase.removeChannel(channel);
      };
    }
  }, [threadId, currentUserId, chatMessages]);
  
  const openChat = async () => {
    // Check if user is logged in and is a customer
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
      
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }
      
      // Find or create a chat thread between customer and mechanic
      const thread = await findOrCreateChatThread(
        currentUserId,
        currentUserName,
        mechanicId,
        mechanicName
      );
      
      console.log('Chat thread found/created:', thread);
      setThreadId(thread.id);
      
      // Get messages for this thread
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
  };
  
  const handleSendMessage = async (content: string) => {
    console.log(`Attempting to send message: ${content}`);
    
    if (!threadId) {
      toast({
        title: "Error",
        description: "Cannot send message. Chat session not initialized.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user || !user.id) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to send messages.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log(`Sending message in thread ${threadId}: ${content}`);
      
      // Send message
      const newMessage = await sendChatMessage(threadId, {
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: mechanicId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
      });
      
      console.log('Message sent successfully:', newMessage);
      
      // Update local state
      setChatMessages(prev => [...prev, newMessage]);
      
      // Show toast for demo purposes
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
  };

  return {
    isChatOpen,
    chatMessages,
    isLoading,
    openChat,
    closeChat: () => setIsChatOpen(false),
    handleSendMessage,
    refreshMessages,
    threadId,  // Export threadId so it can be used in components
  };
}
