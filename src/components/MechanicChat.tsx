
import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { ChatThreadsList } from './chat/ChatThreadsList';
import { ChatView } from './chat/ChatView';
import { getChatThreads } from '@/services/chat/threadService'; 
import { ChatThread } from '@/types/mechanic';
import { useAuth } from '@/hooks/useAuth';
import ErrorBoundary from '@/ErrorBoundary';
import { Button } from '@/components/ui/button';

interface MechanicChatProps {
  initialThreadId?: string;
  onBack?: () => void;
}

const MechanicChat = ({ initialThreadId, onBack }: MechanicChatProps) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreadId || null);
  const [showChatOnMobile, setShowChatOnMobile] = useState(!!initialThreadId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, currentUserRole, currentUserName } = useAuth();
  const currentUserId = user?.id || 'anonymous';
  const userName = currentUserName || 'User';
  
  console.log('MechanicChat rendering with user:', { 
    userId: currentUserId, 
    userRole: currentUserRole,
    userName: userName,
    initialThreadId
  });
  
  const loadThreads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading chat threads for user:', currentUserId);
      if (!currentUserId || currentUserId === 'anonymous') {
        console.warn('User ID is not available, skipping thread loading');
        setThreads([]);
        return;
      }
      
      const userThreads = await getChatThreads(currentUserId);
      console.log('Loaded threads:', userThreads);
      setThreads(userThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      setError("Failed to load chat threads. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);
  
  useEffect(() => {
    // Only load threads if we have a valid user ID
    if (user?.id) {
      console.log('User detected, loading threads');
      loadThreads();
    } else {
      console.log('No user detected, not loading threads');
      setIsLoading(false);
    }
  }, [user, loadThreads]);
  
  useEffect(() => {
    // Set initial thread if provided
    if (initialThreadId) {
      setSelectedThreadId(initialThreadId);
      setShowChatOnMobile(true);
    }
  }, [initialThreadId]);
  
  const handleSelectThread = (threadId: string) => {
    console.log('Thread selected:', threadId);
    setSelectedThreadId(threadId);
    setShowChatOnMobile(true);
  };
  
  const handleBackToList = () => {
    setShowChatOnMobile(false);
    
    // If there's a parent back handler, call it
    if (onBack) {
      onBack();
    }
  };
  
  const handleNewMessage = (threadId: string) => {
    // Reload threads to update last message and unread count
    console.log('New message in thread:', threadId);
    loadThreads();
  };
  
  const selectedThread = threads.find(t => t.id === selectedThreadId);
  
  return (
    <ErrorBoundary fallback={
      <div className="bg-white rounded-lg border h-[600px] p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading chat</p>
          <button 
            onClick={loadThreads} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    }>
      <div className="bg-white rounded-lg border h-[600px] overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-500 text-sm border-b">
            {error}
            <button 
              onClick={loadThreads}
              className="ml-2 underline text-blue-500"
            >
              Retry
            </button>
          </div>
        )}
        <div className="flex h-full">
          {/* Thread list - hidden on mobile when chat is open */}
          <div className={`w-full md:w-1/3 border-r ${showChatOnMobile ? 'hidden md:block' : 'block'}`}>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> Messages
                {currentUserRole && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({currentUserRole === 'mechanic' ? 'Mechanic' : 'Customer'} View)
                  </span>
                )}
              </h2>
            </div>
            
            <ChatThreadsList
              threads={threads}
              currentUserId={currentUserId}
              onSelectThread={handleSelectThread}
              selectedThreadId={selectedThreadId || undefined}
              isLoading={isLoading}
            />
          </div>
          
          {/* Chat view - shown on mobile only when a chat is selected */}
          <div className={`w-full md:w-2/3 ${!showChatOnMobile ? 'hidden md:block' : 'block'}`}>
            {selectedThread ? (
              <ChatView
                thread={selectedThread}
                currentUserId={currentUserId}
                onBack={handleBackToList}
                onNewMessage={handleNewMessage}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MechanicChat;
