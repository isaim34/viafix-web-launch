
import { useEffect } from 'react';
import { ChatMessage } from '@/types/mechanic';
import { supabase } from '@/integrations/supabase/client';

interface UseChatRealtimeProps {
  threadId: string | null;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function useChatRealtime({ threadId, setChatMessages }: UseChatRealtimeProps) {
  useEffect(() => {
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
            
            const formattedMessage: ChatMessage = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_name,
              receiverId: newMessage.receiver_id,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              isRead: newMessage.is_read
            };
            
            setChatMessages(prev => {
              const messageExists = prev.some(msg => msg.id === formattedMessage.id);
              if (messageExists) {
                console.log('Message already exists, skipping duplicate:', formattedMessage.id);
                return prev;
              }
              console.log('Adding new message to chat:', formattedMessage.id);
              return [...prev, formattedMessage];
            });
          }
        )
        .subscribe();
        
      console.log(`Subscribed to chat messages for thread ${threadId}`);
        
      return () => {
        console.log(`Unsubscribing from chat messages for thread ${threadId}`);
        supabase.removeChannel(channel);
      };
    }
  }, [threadId, setChatMessages]);
}
