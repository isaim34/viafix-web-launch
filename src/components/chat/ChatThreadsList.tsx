
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatThread } from '@/types/mechanic';

interface ChatThreadsListProps {
  threads: ChatThread[];
  currentUserId: string;
  onSelectThread: (threadId: string) => void;
  selectedThreadId?: string;
}

export const ChatThreadsList = ({
  threads,
  currentUserId,
  onSelectThread,
  selectedThreadId
}: ChatThreadsListProps) => {
  if (threads.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {threads.map(thread => {
        // Get the other participant name (not the current user)
        const otherParticipantId = thread.participants.find(p => p !== currentUserId) || '';
        const otherParticipantName = thread.participantNames[otherParticipantId] || 'Unknown User';
        
        return (
          <div
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedThreadId === thread.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 text-gray-600 rounded-full p-2">
                <MessageCircle size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium truncate">{otherParticipantName}</h4>
                  {thread.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {new Date(thread.lastMessage.timestamp).toLocaleDateString()}
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
          </div>
        );
      })}
    </div>
  );
};
