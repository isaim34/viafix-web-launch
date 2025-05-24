
import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/mechanic';
import { supabase } from '@/integrations/supabase/client';
import { markMessagesAsRead } from '@/services/chat';

interface UseChatSubscriptionProps {
  threadId: string;
  currentUserId: string;
  onMessageReceived: (message: ChatMessage) => void;
}

export function useChatSubscription({ threadId, currentUserId, onMessageReceived }: UseChatSubscriptionProps) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Set up real-time subscription for new messages
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
          console.log('New chat message received in ChatView:', payload);
          const newMessage = payload.new as any;
          
          // Format the message to match our ChatMessage type
          const formattedMessage: ChatMessage = {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            senderName: newMessage.sender_name,
            receiverId: newMessage.receiver_id,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            isRead: newMessage.is_read
          };
          
          // Add the message via callback
          onMessageReceived(formattedMessage);
          
          // If the message is not from the current user, mark it as read
          if (formattedMessage.senderId !== currentUserId) {
            markMessagesAsRead(threadId, currentUserId);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Supabase channel status for thread ${threadId}:`, status);
      });
    
    // Store channel reference for cleanup
    channelRef.current = channel;
      
    // Clean up subscription on unmount or when thread changes
    return () => {
      console.log(`Cleaning up channel for thread ${threadId}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [threadId, currentUserId, onMessageReceived]);
}
