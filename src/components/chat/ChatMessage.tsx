
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/mechanic';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

export const ChatMessageItem = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p>{message.content}</p>
        <span className="text-xs opacity-70 block mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
          })}
        </span>
      </div>
    </div>
  );
};
