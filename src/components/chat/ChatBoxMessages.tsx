
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/mechanic';

interface ChatBoxMessagesProps {
  localMessages: ChatMessage[];
  currentUserId: string;
  recipientName: string;
  isLoading: boolean;
  sending: boolean;
  isOpen: boolean;
}

export const ChatBoxMessages = ({ 
  localMessages, 
  currentUserId, 
  recipientName, 
  isLoading, 
  sending,
  isOpen 
}: ChatBoxMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, isOpen]);

  if (isLoading || sending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (localMessages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Start a conversation with {recipientName}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {localMessages.map((msg) => (
        <div 
          key={msg.id}
          className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[70%] rounded-lg p-3 ${
              msg.senderId === currentUserId 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <span className="text-xs opacity-70 block mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
