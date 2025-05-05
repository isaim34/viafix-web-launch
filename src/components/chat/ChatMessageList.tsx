
import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/mechanic';
import { ChatMessageItem } from './ChatMessage';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  currentUserId: string;
  isLoading: boolean;
}

export const ChatMessageList = ({ messages, currentUserId, isLoading }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <ChatMessageItem 
          key={msg.id}
          message={msg}
          isCurrentUser={msg.senderId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
