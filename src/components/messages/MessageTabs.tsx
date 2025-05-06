
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Inbox } from 'lucide-react';
import { ChatThreadsList } from '@/components/chat/ChatThreadsList';
import MechanicMailbox from '@/components/MechanicMailbox';
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
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        {currentUserRole === 'mechanic' ? (
          <>
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Messages
            </TabsTrigger>
          </>
        ) : (
          // For customers, simplify to just "Messages" since they don't need mechanic-specific tabs
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
        )}
      </TabsList>
      
      {/* Mechanic-specific inbox tab */}
      {currentUserRole === 'mechanic' && (
        <TabsContent value="inbox">
          <MechanicMailbox />
        </TabsContent>
      )}
      
      {/* Chat messages tab - available for both roles but with different presentation */}
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
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">
          {currentUserRole === 'mechanic' 
            ? 'Your Customer Conversations' 
            : 'Your Mechanic Conversations'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentUserRole === 'mechanic'
            ? 'Manage your conversations with customers here.'
            : 'Contact and chat with mechanics about your vehicle repairs and maintenance here.'}
        </p>
      </div>
      {error ? (
        <div className="p-4 bg-red-50 text-red-500 text-sm border-b">
          {error}
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
