
import React from 'react';
import { User, Clock, ThumbsUp, Reply } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ReplyItem } from './ReplyItem';
import { ReplyForm } from './ReplyForm';

interface Reply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
  taggedUsers?: string[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
  taggedUsers?: string[];
}

interface CommentItemProps {
  comment: Comment;
  replyingTo: string | null;
  replyContent: string;
  setReplyingTo: (id: string | null) => void;
  setReplyContent: (content: string) => void;
  onLikeComment: (id: string) => void;
  onSubmitReply: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  formatDate: (date: Date) => string;
  formatContentWithTags: (content: string) => string;
  availableUsers: Array<{ id: string; name: string }>;
  onTagUser: (userId: string, userName: string) => void;
}

export const CommentItem = ({
  comment,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
  onLikeComment,
  onSubmitReply,
  onLikeReply,
  formatDate,
  formatContentWithTags,
  availableUsers,
  onTagUser
}: CommentItemProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10 bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-medium">{comment.userName}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(comment.timestamp)}
            </span>
          </div>
          <p 
            className="text-gray-700 mb-3"
            dangerouslySetInnerHTML={{ __html: formatContentWithTags(comment.content) }}
          />
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onLikeComment(comment.id)}
              className="text-sm flex items-center text-gray-500 hover:text-primary transition-colors"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}
            </button>
            <button 
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-sm flex items-center text-gray-500 hover:text-primary transition-colors"
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </button>
          </div>
          
          {replyingTo === comment.id && (
            <ReplyForm
              value={replyContent}
              onChange={setReplyContent}
              onSubmit={() => onSubmitReply(comment.id)}
              onCancel={() => setReplyingTo(null)}
              onTagUser={onTagUser}
              availableUsers={availableUsers}
            />
          )}
          
          {comment.replies.length > 0 && (
            <div className="mt-4 pl-6 space-y-4 border-l border-gray-100">
              {comment.replies.map(reply => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  commentId={comment.id}
                  onLikeReply={onLikeReply}
                  formatDate={formatDate}
                  formatContentWithTags={formatContentWithTags}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
