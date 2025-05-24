
import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/mechanic';
import { ChatMessage } from './ChatMessage';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  currentUserId: string;
  recipientName?: string;
}

export const ChatMessageList = ({ messages, currentUserId, recipientName }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Start a conversation with {recipientName || 'this user'}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isCurrentUser={message.senderId === currentUserId}
          recipientName={recipientName}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
