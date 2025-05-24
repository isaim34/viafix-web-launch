
import { useEffect } from 'react';
import { ChatMessage } from '@/types/mechanic';
import { supabase } from '@/integrations/supabase/client';

interface UseChatBoxSubscriptionProps {
  isOpen: boolean;
  threadId?: string;
  setLocalMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function useChatBoxSubscription({ 
  isOpen, 
  threadId, 
  setLocalMessages 
}: UseChatBoxSubscriptionProps) {
  useEffect(() => {
    if (isOpen && threadId) {
      const channel = supabase
        .channel(`chat_box_${threadId}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'chat_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('ChatBox: New message received:', payload);
            const newMessage = payload.new as any;
            
            // Format the message
            const formattedMessage: ChatMessage = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_name,
              receiverId: newMessage.receiver_id,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              isRead: newMessage.is_read
            };
            
            // Only add if not already in our list
            setLocalMessages(prev => {
              const messageExists = prev.some(msg => msg.id === formattedMessage.id);
              if (messageExists) {
                console.log('Message already exists in ChatBox, skipping duplicate:', formattedMessage.id);
                return prev;
              }
              console.log('Adding new message to ChatBox:', formattedMessage.id);
              return [...prev, formattedMessage];
            });
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, threadId, setLocalMessages]);
}
