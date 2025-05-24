
import React from 'react';
import { ChatMessage } from '@/types/mechanic';
import { ChatBoxHeader } from './ChatBoxHeader';
import { ChatBoxMessages } from './ChatBoxMessages';
import { ChatBoxInput } from './ChatBoxInput';
import { useChatBoxState } from '@/hooks/chat/useChatBoxState';
import { useChatBoxSubscription } from '@/hooks/chat/useChatBoxSubscription';
import { useChatBoxActions } from '@/hooks/chat/useChatBoxActions';

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  currentUserId: string;
  currentUserName: string;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  threadId?: string;
}

export const ChatBox = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  currentUserId,
  currentUserName,
  messages,
  onSendMessage,
  isLoading = false,
  threadId,
}: ChatBoxProps) => {
  const {
    messageText,
    setMessageText,
    localMessages,
    setLocalMessages,
    sending,
    setSending,
    clearMessageText
  } = useChatBoxState({ messages, isOpen });

  useChatBoxSubscription({
    isOpen,
    threadId,
    setLocalMessages
  });

  const { handleSendMessage } = useChatBoxActions({
    messageText,
    clearMessageText,
    setSending,
    onSendMessage,
    threadId,
    currentUserId,
    currentUserName,
    recipientId,
    recipientName
  });

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50">
      <ChatBoxHeader 
        recipientName={recipientName}
        onClose={onClose}
      />
      
      <ChatBoxMessages
        localMessages={localMessages}
        currentUserId={currentUserId}
        recipientName={recipientName}
        isLoading={isLoading}
        sending={sending}
        isOpen={isOpen}
      />
      
      <ChatBoxInput
        messageText={messageText}
        setMessageText={setMessageText}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        sending={sending}
      />
    </div>
  );
};
