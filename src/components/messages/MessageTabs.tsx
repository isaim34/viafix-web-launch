
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from 'lucide-react';
import { ChatThreadsList } from '@/components/chat/ChatThreadsList';
import { ChatThread } from '@/types/mechanic';

interface MessageTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserRole?: string;
  currentUserId: string;
  threads: ChatThread[];
  selectedThreadId: string | null;
  handleSelectThread: (threadId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const MessageTabs = ({
  activeTab,
  setActiveTab,
  currentUserRole,
  currentUserId,
  threads,
  selectedThreadId,
  handleSelectThread,
  isLoading,
  error
}: MessageTabsProps) => {
  console.log('MessageTabs component rendering with:', {
    currentUserRole,
    currentUserId,
    threadsCount: threads?.length || 0,
    isLoading,
    error,
    activeTab
  });

  return (
    <Tabs value="chat" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat">
        <MessageThreadsPanel 
          threads={threads}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          selectedThreadId={selectedThreadId}
          handleSelectThread={handleSelectThread}
          isLoading={isLoading}
          error={error}
        />
      </TabsContent>
    </Tabs>
  );
};

interface MessageThreadsPanelProps {
  threads: ChatThread[];
  currentUserId: string;
  currentUserRole?: string;
  selectedThreadId: string | null;
  handleSelectThread: (threadId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const MessageThreadsPanel = ({
  threads,
  currentUserId,
  currentUserRole,
  selectedThreadId,
  handleSelectThread,
  isLoading,
  error
}: MessageThreadsPanelProps) => {
  console.log('MessageThreadsPanel rendering with:', {
    threadsCount: threads?.length || 0,
    currentUserId,
    currentUserRole,
    isLoading,
    error
  });

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">
          {currentUserRole === 'mechanic' 
            ? 'Customer Conversations' 
            : 'Mechanic Conversations'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentUserRole === 'mechanic'
            ? 'All your conversations with customers including booking requests, inquiries, and ongoing chats.'
            : 'Contact and chat with mechanics about your vehicle repairs and maintenance.'}
        </p>
      </div>
      {error ? (
        <div className="p-4 bg-red-50 text-red-500 text-sm border-b">
          Error: {error}
        </div>
      ) : (
        <ChatThreadsList 
          threads={threads}
          currentUserId={currentUserId}
          onSelectThread={handleSelectThread}
          selectedThreadId={selectedThreadId || undefined}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default MessageTabs;
