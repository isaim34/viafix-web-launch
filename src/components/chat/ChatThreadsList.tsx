
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatThread } from '@/types/mechanic';
import { Button } from '@/components/ui/button';

interface ChatThreadsListProps {
  threads: ChatThread[];
  currentUserId: string;
  onSelectThread: (threadId: string) => void;
  selectedThreadId?: string;
  isLoading?: boolean;
}

export const ChatThreadsList = ({
  threads,
  currentUserId,
  onSelectThread,
  selectedThreadId,
  isLoading = false
}: ChatThreadsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (threads.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Start a conversation with a mechanic or customer</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {threads.map(thread => {
        // Get the other participant name (not the current user)
        const otherParticipantId = thread.participants.find(p => p !== currentUserId) || '';
        const otherParticipantName = thread.participantNames[otherParticipantId] || 'Unknown User';
        
        // Format the last message timestamp
        const lastMessageTime = thread.lastMessageAt ? new Date(thread.lastMessageAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
        
        return (
          <Button
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            variant="ghost"
            className={`w-full p-4 h-auto justify-start rounded-none ${
              selectedThreadId === thread.id ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="bg-gray-100 text-gray-600 rounded-full p-2">
                <MessageCircle size={16} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium truncate text-gray-900">{otherParticipantName}</h4>
                  {lastMessageTime && (
                    <span className="text-xs text-gray-500">
                      {lastMessageTime}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <p className="text-sm text-gray-700 truncate flex-1">
                    {thread.lastMessage ? thread.lastMessage.content : 'No messages yet'}
                  </p>
                  
                  {thread.unreadCount > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
