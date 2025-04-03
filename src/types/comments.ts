
export type CommentSortOption = 'newest' | 'oldest' | 'popular';

export type Reply = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
  taggedUsers?: string[];
};

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
  taggedUsers?: string[];
};

export interface User {
  id: string;
  name: string;
}

export interface CommentContextType {
  comments: Comment[];
  commentCount: number;
  newComment: string;
  setNewComment: (value: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (value: string) => void;
  sortOption: CommentSortOption;
  setSortOption: (option: CommentSortOption) => void;
  editingCommentId: string | null;
  editingReplyId: string | null;
  editContent: string;
  setEditContent: (value: string) => void;
  handleSubmitComment: () => void;
  handleSubmitReply: (commentId: string) => void;
  handleLikeComment: (id: string) => void;
  handleLikeReply: (commentId: string, replyId: string) => void;
  handleEditComment: (commentId: string) => void;
  handleEditReply: (commentId: string, replyId: string) => void;
  handleSaveCommentEdit: (commentId: string) => void;
  handleSaveReplyEdit: (commentId: string, replyId: string) => void;
  cancelEdit: () => void;
  formatDate: (date: Date) => string;
  formatContentWithTags: (content: string) => string;
  isCommentOwner: (userId: string) => boolean;
}
