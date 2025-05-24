
import React from 'react';
import { ChatThread } from '@/types/mechanic';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useChatView } from '@/hooks/chat/useChatView';

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
  const {
    messages,
    isLoading,
    isSending,
    error,
    otherParticipantName,
    handleSendMessage,
    loadMessages,
    setError
  } = useChatView({ thread, currentUserId, onNewMessage });
  
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
            onClick={() => {
              setError(null);
              loadMessages();
            }}
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
        isLoading={isLoading || isSending}
      />
    </div>
  );
};
