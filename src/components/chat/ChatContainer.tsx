
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatThreadsList } from './ChatThreadsList';
import { ChatView } from './ChatView';
import EmptyChatState from './EmptyChatState';
import { ChatThread } from '@/types/mechanic';

interface ChatContainerProps {
  threads: ChatThread[];
  selectedThread: ChatThread | undefined;
  selectedThreadId: string | null;
  showChatOnMobile: boolean;
  isLoading: boolean;
  currentUserId: string;
  currentUserRole?: string;
  onSelectThread: (threadId: string) => void;
  onBack: () => void;
  onNewMessage: (threadId: string) => void;
}

const ChatContainer = ({
  threads,
  selectedThread,
  selectedThreadId,
  showChatOnMobile,
  isLoading,
  currentUserId,
  currentUserRole,
  onSelectThread,
  onBack,
  onNewMessage
}: ChatContainerProps) => {
  return (
    <div className="flex h-full">
      {/* Thread list - hidden on mobile when chat is open */}
      <div className={`w-full md:w-1/3 border-r ${showChatOnMobile ? 'hidden md:block' : 'block'}`}>
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>
              {currentUserRole === 'mechanic' ? 'Customer Messages' : 'Mechanic Messages'}
            </span>
          </div>
        </div>
        
        <ChatThreadsList
          threads={threads}
          currentUserId={currentUserId}
          onSelectThread={onSelectThread}
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
            onBack={onBack}
            onNewMessage={onNewMessage}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
