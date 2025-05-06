
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatThread } from '@/types/mechanic';
import { getChatMessages, sendChatMessage, markMessagesAsRead } from '@/services/chat';
import { supabase } from '@/integrations/supabase/client';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { toast } from '@/hooks/use-toast';

interface ChatViewProps {
  thread: ChatThread;
  currentUserId: string;
  onBack: () => void;
  onNewMessage: (threadId: string) => void;
}

export const ChatView = ({
  thread,
  currentUserId,
  onBack,
  onNewMessage
}: ChatViewProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  
  // Get the other participant (not the current user)
  const otherParticipantId = thread.participants.find(p => p !== currentUserId) || '';
  const otherParticipantName = thread.participantNames[otherParticipantId] || 'Unknown User';
  
  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading messages for thread ${thread.id}`);
      const chatMessages = await getChatMessages(thread.id);
      console.log('Messages loaded:', chatMessages);
      setMessages(chatMessages);
      
      // Mark messages as read
      await markMessagesAsRead(thread.id, currentUserId);
      
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Load messages for this thread
    loadMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`chat_messages_${thread.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `thread_id=eq.${thread.id}`
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
          
          // Only add the message if it's not already in our list
          setMessages(prev => {
            if (prev.some(msg => msg.id === formattedMessage.id)) {
              return prev;
            }
            return [...prev, formattedMessage];
          });
          
          // If the message is not from the current user, mark it as read
          if (formattedMessage.senderId !== currentUserId) {
            markMessagesAsRead(thread.id, currentUserId);
          }
        }
      )
      .subscribe();
    
    // Store channel reference for cleanup
    channelRef.current = channel;
      
    // Clean up subscription on unmount or when thread changes
    return () => {
      console.log(`Cleaning up channel for thread ${thread.id}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [thread.id, currentUserId]); // Removed messages from dependency array
  
  const handleSendMessage = async (messageText: string) => {
    try {
      console.log(`Sending message in thread ${thread.id}: ${messageText}`);
      
      // Get the current user name from localStorage or thread data
      const currentUserName = thread.participantNames[currentUserId] || localStorage.getItem('userName') || 'Me';
      
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
      
      const newMessage = await sendChatMessage(thread.id, newMessageData);
      console.log('Message sent successfully:', newMessage);
      
      // Update local state with the returned message that has an ID
      setMessages(prev => [...prev, newMessage]);
      
      // Show confirmation toast
      toast({
        title: "Message Sent",
        description: `Your message to ${otherParticipantName} was sent successfully.`
      });
      
      // Notify parent
      onNewMessage(thread.id);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
      toast({
        title: "Message Error",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        participantName={otherParticipantName}
        onBack={onBack}
      />
      
      {error && (
        <div className="bg-red-50 p-2 text-red-500 text-sm text-center">
          {error}
          <button 
            className="ml-2 underline"
            onClick={loadMessages}
          >
            Retry
          </button>
        </div>
      )}
      
      <ChatMessageList 
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
