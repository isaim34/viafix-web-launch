
import React from 'react';
import ChatLayout from './chat/ChatLayout';
import ChatContainer from './chat/ChatContainer';
import { useMechanicChatState } from '@/hooks/useMechanicChatState';

interface MechanicChatProps {
  initialThreadId?: string;
  onBack?: () => void;
}

const MechanicChat = ({ initialThreadId, onBack }: MechanicChatProps) => {
  const {
    threads,
    selectedThread,
    selectedThreadId,
    showChatOnMobile,
    isLoading,
    error,
    currentUserId,
    currentUserRole,
    handleSelectThread,
    handleBackToList,
    handleNewMessage,
    loadThreads
  } = useMechanicChatState(initialThreadId);
  
  const handleBackWithParent = () => {
    handleBackToList();
    
    // If there's a parent back handler, call it
    if (onBack) {
      onBack();
    }
  };
  
  return (
    <ChatLayout
      error={error}
      onRetry={loadThreads}
    >
      <ChatContainer
        threads={threads}
        selectedThread={selectedThread}
        selectedThreadId={selectedThreadId}
        showChatOnMobile={showChatOnMobile}
        isLoading={isLoading}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onSelectThread={handleSelectThread}
        onBack={handleBackWithParent}
        onNewMessage={handleNewMessage}
      />
    </ChatLayout>
  );
};

export default MechanicChat;
