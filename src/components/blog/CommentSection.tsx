
import React from 'react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { CommentForm } from './comments/CommentForm';
import { CommentFilter } from './comments/CommentFilter';
import { CommentList } from './comments/CommentList';
import { CommentProvider } from '@/contexts/CommentContext';
import { User } from '@/types/comments';

interface CommentSectionProps {
  postSlug: string;
}

export const CommentSection = ({ postSlug }: CommentSectionProps) => {
  const { isLoggedIn, currentUserName, currentUserId } = useCustomerAuth();
  const availableUsers: User[] = [
    { id: 'user1', name: 'Alex Johnson' },
    { id: 'user2', name: 'Sarah Thompson' },
    { id: 'user3', name: 'Michael Davis' },
    { id: 'user4', name: 'Emma Wilson' },
    { id: 'user5', name: 'David Clark' },
  ];
  
  const handleTagUser = (userId: string, userName: string) => {
    // This function gets passed down to child components
    // and handles the tagging of users in comments and replies
  };

  return (
    <CommentProvider
      postSlug={postSlug}
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      isLoggedIn={isLoggedIn}
    >
      <CommentsContent
        availableUsers={availableUsers}
        onTagUser={handleTagUser}
      />
    </CommentProvider>
  );
};

interface CommentsContentProps {
  availableUsers: User[];
  onTagUser: (userId: string, userName: string) => void;
}

const CommentsContent = ({ availableUsers, onTagUser }: CommentsContentProps) => {
  const {
    comments,
    commentCount,
    newComment,
    setNewComment,
    sortOption,
    setSortOption,
    handleSubmitComment,
    replyingTo,
    replyContent,
    setReplyingTo,
    setReplyContent,
    handleLikeComment,
    handleSubmitReply,
    handleLikeReply,
    formatDate,
    formatContentWithTags,
    isCommentOwner,
    editingCommentId,
    editingReplyId,
    editContent,
    setEditContent,
    handleEditComment,
    handleEditReply,
    handleSaveCommentEdit,
    handleSaveReplyEdit,
    cancelEdit
  } = useCommentContext();

  const isCommentBeingEdited = (id: string) => editingCommentId === id;
  
  return (
    <div className="mt-12 relative">
      <h2 className="text-2xl font-bold mb-6">Comments ({commentCount})</h2>
      
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Join the conversation</h3>
        <CommentForm
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleSubmitComment}
          onTagUser={onTagUser}
          availableUsers={availableUsers}
        />
      </div>
      
      {commentCount > 0 && (
        <CommentFilter 
          currentFilter={sortOption} 
          onFilterChange={setSortOption} 
        />
      )}
      
      <CommentList
        comments={comments}
        replyingTo={replyingTo}
        replyContent={replyContent}
        setReplyingTo={setReplyingTo}
        setReplyContent={setReplyContent}
        onLikeComment={handleLikeComment}
        onSubmitReply={handleSubmitReply}
        onLikeReply={handleLikeReply}
        formatDate={formatDate}
        formatContentWithTags={formatContentWithTags}
        availableUsers={availableUsers}
        onTagUser={onTagUser}
        isEditing={isCommentBeingEdited}
        editingReplyId={editingReplyId}
        editContent={editContent}
        setEditContent={setEditContent}
        onEdit={handleEditComment}
        onSaveEdit={handleSaveCommentEdit}
        onCancelEdit={cancelEdit}
        onEditReply={handleEditReply}
        onSaveReplyEdit={handleSaveReplyEdit}
        isCommentOwner={isCommentOwner}
      />
    </div>
  );
};
