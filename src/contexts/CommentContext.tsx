
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { Comment, Reply, CommentSortOption, CommentContextType } from '@/types/comments';
import { extractTaggedUsers, formatContentWithTags, formatDate } from '@/utils/commentUtils';

const CommentContext = createContext<CommentContextType | undefined>(undefined);

interface CommentProviderProps {
  children: React.ReactNode;
  postSlug: string;
  currentUserId: string | null;
  currentUserName: string | null;
  isLoggedIn: boolean;
}

export const CommentProvider = ({ 
  children, 
  postSlug,
  currentUserId,
  currentUserName,
  isLoggedIn
}: CommentProviderProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Alex Johnson',
      content: "Great article! I've been using ViaFix for my auto repair needs for the past 6 months, and the service has been consistently excellent.",
      timestamp: new Date(2025, 3, 3, 14, 30),
      likes: 5,
      replies: [
        {
          id: '1-1',
          userId: 'user2',
          userName: 'Sarah Thompson',
          content: "I agree! The mechanics are always professional and know what they're doing.",
          timestamp: new Date(2025, 3, 3, 15, 15),
          likes: 2,
        }
      ]
    },
    {
      id: '2',
      userId: 'user3',
      userName: 'Michael Davis',
      content: "I'm considering becoming a mechanic on ViaFix. Does anyone know how the onboarding process works?",
      timestamp: new Date(2025, 3, 2, 10, 45),
      likes: 3,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortOption, setSortOption] = useState<CommentSortOption>('newest');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Sort comments based on selected filter
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return b.timestamp.getTime() - a.timestamp.getTime();
      case 'oldest':
        return a.timestamp.getTime() - b.timestamp.getTime();
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });
  
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    if (!isLoggedIn) {
      toast("Please sign in to post a comment");
      return;
    }
    
    const taggedUsers = extractTaggedUsers(newComment);
    
    const newCommentObj: Comment = {
      id: `${comments.length + 1}`,
      userId: currentUserId || 'current-user',
      userName: currentUserName || 'Anonymous User',
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    if (taggedUsers.length > 0) {
      toast(`${taggedUsers.length} user(s) have been tagged in your comment`);
    } else {
      toast("Comment posted successfully");
    }
  };
  
  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim() || !replyingTo) return;
    
    if (!isLoggedIn) {
      toast("Please sign in to post a reply");
      return;
    }
    
    const taggedUsers = extractTaggedUsers(replyContent);
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: `${comment.id}-${comment.replies.length + 1}`,
              userId: currentUserId || 'current-user',
              userName: currentUserName || 'Anonymous User',
              content: replyContent,
              timestamp: new Date(),
              likes: 0,
              taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined
            }
          ]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyContent('');
    setReplyingTo(null);
    
    if (taggedUsers.length > 0) {
      toast(`${taggedUsers.length} user(s) have been tagged in your reply`);
    } else {
      toast("Reply posted successfully");
    }
  };
  
  const handleLikeComment = (commentId: string) => {
    if (!isLoggedIn) {
      toast("Please sign in to like comments");
      return;
    }
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likes + 1
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };
  
  const handleLikeReply = (commentId: string, replyId: string) => {
    if (!isLoggedIn) {
      toast("Please sign in to like replies");
      return;
    }
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: reply.likes + 1
              };
            }
            return reply;
          })
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditContent(comment.content);
    }
  };

  const handleEditReply = (commentId: string, replyId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      const reply = comment.replies.find(r => r.id === replyId);
      if (reply) {
        setEditingReplyId(replyId);
        setEditContent(reply.content);
      }
    }
  };

  const handleSaveCommentEdit = (commentId: string) => {
    if (!editContent.trim()) return;
    
    const taggedUsers = extractTaggedUsers(editContent);
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: editContent,
          taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setEditingCommentId(null);
    setEditContent('');
    toast("Comment updated successfully");
  };

  const handleSaveReplyEdit = (commentId: string, replyId: string) => {
    if (!editContent.trim()) return;
    
    const taggedUsers = extractTaggedUsers(editContent);
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                content: editContent,
                taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined
              };
            }
            return reply;
          })
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setEditingReplyId(null);
    setEditContent('');
    toast("Reply updated successfully");
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingReplyId(null);
    setEditContent('');
  };

  const isCommentOwner = (userId: string) => {
    return currentUserId === userId;
  };

  const value = {
    comments: sortedComments,
    commentCount: comments.length,
    newComment,
    setNewComment,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    sortOption,
    setSortOption,
    editingCommentId,
    editingReplyId,
    editContent,
    setEditContent,
    handleSubmitComment,
    handleSubmitReply,
    handleLikeComment,
    handleLikeReply,
    handleEditComment,
    handleEditReply,
    handleSaveCommentEdit,
    handleSaveReplyEdit,
    cancelEdit,
    formatDate,
    formatContentWithTags,
    isCommentOwner
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useCommentContext must be used within a CommentProvider');
  }
  return context;
};
