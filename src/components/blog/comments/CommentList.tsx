
import React from 'react';
import { CommentItem } from './CommentItem';
import { EmptyComments } from './EmptyComments';
import { Comment } from '@/types/comments';

interface CommentListProps {
  comments: Comment[];
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
  isEditing: (id: string) => boolean;
  editingReplyId: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  onEdit: (id: string) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onEditReply: (commentId: string, replyId: string) => void;
  onSaveReplyEdit: (commentId: string, replyId: string) => void;
  isCommentOwner: (userId: string) => boolean;
}

export const CommentList = ({
  comments,
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
  onTagUser,
  isEditing,
  editingReplyId,
  editContent,
  setEditContent,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onEditReply,
  onSaveReplyEdit,
  isCommentOwner
}: CommentListProps) => {
  if (comments.length === 0) {
    return <EmptyComments />;
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replyingTo={replyingTo}
          replyContent={replyContent}
          setReplyingTo={setReplyingTo}
          setReplyContent={setReplyContent}
          onLikeComment={onLikeComment}
          onSubmitReply={onSubmitReply}
          onLikeReply={onLikeReply}
          formatDate={formatDate}
          formatContentWithTags={formatContentWithTags}
          availableUsers={availableUsers}
          onTagUser={onTagUser}
          isEditing={isEditing(comment.id)}
          editContent={isEditing(comment.id) ? editContent : ''}
          setEditContent={setEditContent}
          onEdit={onEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEditReply={onEditReply}
          editingReplyId={editingReplyId}
          onSaveReplyEdit={onSaveReplyEdit}
          isCommentOwner={isCommentOwner}
        />
      ))}
    </div>
  );
};
