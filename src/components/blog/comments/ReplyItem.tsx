
import React from 'react';
import { User, Clock, ThumbsUp } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface Reply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
  taggedUsers?: string[];
}

interface ReplyItemProps {
  reply: Reply;
  commentId: string;
  onLikeReply: (commentId: string, replyId: string) => void;
  formatDate: (date: Date) => string;
  formatContentWithTags: (content: string) => string;
}

export const ReplyItem = ({
  reply,
  commentId,
  onLikeReply,
  formatDate,
  formatContentWithTags
}: ReplyItemProps) => {
  return (
    <div className="bg-gray-50 p-3 rounded">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8 bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-medium">{reply.userName}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(reply.timestamp)}
            </span>
          </div>
          <p 
            className="text-gray-700 mb-2"
            dangerouslySetInnerHTML={{ __html: formatContentWithTags(reply.content) }}
          />
          <button 
            onClick={() => onLikeReply(commentId, reply.id)}
            className="text-xs flex items-center text-gray-500 hover:text-primary transition-colors"
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            {reply.likes} {reply.likes === 1 ? 'Like' : 'Likes'}
          </button>
        </div>
      </div>
    </div>
  );
};
