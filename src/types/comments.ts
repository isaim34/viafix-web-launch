
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
