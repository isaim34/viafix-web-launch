
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/mechanic';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  recipientName?: string;
}

export const ChatMessage = ({ message, isCurrentUser, recipientName }: ChatMessageProps) => {
  // Check if this is a custom offer message
  const isCustomOfferMessage = message.content.includes('custom service request') && 
                              message.content.includes('Service Details:');

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isCustomOfferMessage ? (
          <div className="space-y-2">
            <div className="text-xs opacity-70 uppercase tracking-wide font-medium">
              Custom Service Request
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {message.content}
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-line">{message.content}</p>
        )}
        <span className="text-xs opacity-70 block mt-2">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};
