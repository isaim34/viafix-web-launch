
import React from 'react';
import ErrorBoundary from '@/ErrorBoundary';
import { useMessagePage } from '@/hooks/useMessagePage';
import AuthRequiredAlert from '@/components/messages/AuthRequiredAlert';
import MessagesHeader from '@/components/messages/MessagesHeader';
import MessageTabs from '@/components/messages/MessageTabs';
import ChatViewContainer from '@/components/messages/ChatViewContainer';

const MessagesContent = () => {
  console.log('MessagesContent component mounting');
  
  const {
    isLoggedIn,
    currentUserRole,
    currentUserId,
    activeTab,
    setActiveTab,
    threads,
    selectedThreadId,
    showChatView,
    isLoading,
    error,
    handleSelectThread,
    handleBackToList
  } = useMessagePage();

  console.log('MessagesContent - Hook data:', {
    isLoggedIn,
    currentUserRole,
    currentUserId,
    threadsCount: threads?.length || 0,
    isLoading,
    error,
    showChatView,
    selectedThreadId
  });

  // Show login required message if not logged in
  if (!isLoggedIn) {
    console.log('MessagesContent - User not logged in, showing auth alert');
    return <AuthRequiredAlert />;
  }
  
  console.log('MessagesContent - Rendering main content');
  
  return (
    <div>
      <MessagesHeader />
      
      <ErrorBoundary>
        {showChatView && selectedThreadId ? (
          <ChatViewContainer 
            selectedThreadId={selectedThreadId} 
            handleBackToList={handleBackToList} 
          />
        ) : (
          <MessageTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
            threads={threads}
            selectedThreadId={selectedThreadId}
            handleSelectThread={handleSelectThread}
            isLoading={isLoading}
            error={error}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default MessagesContent;
