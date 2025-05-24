
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatThread } from '@/types/mechanic';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useChatView } from '@/hooks/chat/useChatView';

interface ChatViewProps {
  thread: ChatThread;
  currentUserId: string;
  currentUserRole?: string;
  onBack: () => void;
  onNewMessage: (threadId: string) => void;
}

export const ChatView = ({ 
  thread, 
  currentUserId, 
  currentUserRole, 
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

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadMessages} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {otherParticipantName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{otherParticipantName}</h3>
            <p className="text-sm text-muted-foreground">
              {currentUserRole === 'mechanic' ? 'Customer' : 'Mechanic'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ChatMessageList
          messages={messages}
          currentUserId={currentUserId}
          recipientName={otherParticipantName}
        />
      )}

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isSending}
        placeholder={`Message ${otherParticipantName}...`}
      />
    </div>
  );
};
