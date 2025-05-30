
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
