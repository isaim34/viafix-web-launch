
import React from 'react';
import { Layout } from "@/components/Layout";
import ErrorBoundary from '@/ErrorBoundary';
import { useMessagePage } from '@/hooks/useMessagePage';
import AuthRequiredAlert from '@/components/messages/AuthRequiredAlert';
import MessagesHeader from '@/components/messages/MessagesHeader';
import MessageTabs from '@/components/messages/MessageTabs';
import ChatViewContainer from '@/components/messages/ChatViewContainer';

const Messages = () => {
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

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container max-w-5xl py-8">
          <AuthRequiredAlert />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-5xl py-8">
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
    </Layout>
  );
};

export default Messages;
