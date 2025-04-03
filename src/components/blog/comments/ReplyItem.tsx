
import React from 'react';
import { User, Clock, ThumbsUp, Edit, Check, X } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/Button';

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
  isEditing: boolean;
  editContent: string;
  setEditContent: (content: string) => void;
  onEdit: (commentId: string, replyId: string) => void;
  onSaveEdit: (commentId: string, replyId: string) => void;
  onCancelEdit: () => void;
  isReplyOwner: (userId: string) => boolean;
}

export const ReplyItem = ({
  reply,
  commentId,
  onLikeReply,
  formatDate,
  formatContentWithTags,
  isEditing,
  editContent,
  setEditContent,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  isReplyOwner
}: ReplyItemProps) => {
  const canEdit = isReplyOwner(reply.userId);

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
          
          {isEditing ? (
            <div className="mb-2">
              <Textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mb-2 text-sm"
                placeholder="Edit your reply..."
              />
              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onSaveEdit(commentId, reply.id)}
                  icon={<Check className="h-3 w-3" />}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancelEdit}
                  icon={<X className="h-3 w-3" />}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p 
              className="text-gray-700 mb-2"
              dangerouslySetInnerHTML={{ __html: formatContentWithTags(reply.content) }}
            />
          )}
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onLikeReply(commentId, reply.id)}
              className="text-xs flex items-center text-gray-500 hover:text-primary transition-colors"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              {reply.likes} {reply.likes === 1 ? 'Like' : 'Likes'}
            </button>
            
            {canEdit && !isEditing && (
              <button 
                onClick={() => onEdit(commentId, reply.id)}
                className="text-xs flex items-center text-gray-500 hover:text-primary transition-colors"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
