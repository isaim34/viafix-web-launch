
import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatThreadsList } from './chat/ChatThreadsList';
import { ChatView } from './chat/ChatView';
import { getChatThreads } from '@/services/chatService';
import { ChatThread } from '@/types/mechanic';
import { useAuth } from '@/hooks/useAuth';

const MechanicChat = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, currentUserRole, currentUserName } = useAuth();
  const currentUserId = user?.id || 'anonymous';
  const userName = currentUserName || 'User';
  
  const loadThreads = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Loading chat threads for user:', currentUserId);
      const userThreads = await getChatThreads(currentUserId);
      console.log('Loaded threads:', userThreads);
      setThreads(userThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);
  
  useEffect(() => {
    // Only load threads if we have a valid user ID
    if (user?.id) {
      loadThreads();
    }
  }, [user, loadThreads]);
  
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setShowChatOnMobile(true);
  };
  
  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };
  
  const handleNewMessage = (threadId: string) => {
    // Reload threads to update last message and unread count
    loadThreads();
  };
  
  const selectedThread = threads.find(t => t.id === selectedThreadId);
  
  return (
    <div className="bg-white rounded-lg border h-[600px] overflow-hidden">
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
  );
};

export default MechanicChat;
