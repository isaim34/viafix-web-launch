import React, { useState, useRef, useEffect } from 'react';
import { User, Clock, MessageCircle, ThumbsUp, Reply, AtSign } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { toast } from 'sonner';
import { UserTagSelector } from './UserTagSelector';

type Comment = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
  taggedUsers?: string[];
};

type Reply = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
  taggedUsers?: string[];
};

interface CommentSectionProps {
  postSlug: string;
}

export const CommentSection = ({ postSlug }: CommentSectionProps) => {
  const { isLoggedIn, currentUserName } = useCustomerAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [tagSelectorPosition, setTagSelectorPosition] = useState({ top: 0, left: 0 });
  const [currentInputField, setCurrentInputField] = useState<'comment' | 'reply'>('comment');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  
  const [availableUsers] = useState([
    { id: 'user1', name: 'Alex Johnson' },
    { id: 'user2', name: 'Sarah Thompson' },
    { id: 'user3', name: 'Michael Davis' },
    { id: 'user4', name: 'Emma Wilson' },
    { id: 'user5', name: 'David Clark' },
  ]);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: 'comment' | 'reply') => {
    const text = e.target.value;
    type === 'comment' ? setNewComment(text) : setReplyContent(text);
    
    const caretPosition = e.target.selectionStart || 0;
    const textUpToCaret = text.substring(0, caretPosition);
    const lastAtSymbolIndex = textUpToCaret.lastIndexOf('@');
    
    if (lastAtSymbolIndex !== -1 && 
        (lastAtSymbolIndex === 0 || text[lastAtSymbolIndex - 1] === ' ') && 
        caretPosition > lastAtSymbolIndex) {
      
      const input = type === 'comment' ? commentInputRef.current : replyInputRef.current;
      if (input) {
        const rect = input.getBoundingClientRect();
        setTagSelectorPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left
        });
      }
      
      setCurrentInputField(type);
      setShowTagSelector(true);
    } else {
      setShowTagSelector(false);
    }
  };
  
  const handleTagUser = (userId: string, userName: string) => {
    const currentText = currentInputField === 'comment' ? newComment : replyContent;
    let updatedText = currentText;
    
    const lastAtSymbolIndex = updatedText.lastIndexOf('@');
    if (lastAtSymbolIndex !== -1) {
      const input = currentInputField === 'comment' ? commentInputRef.current : replyInputRef.current;
      const caretPosition = input?.selectionStart || updatedText.length;
      const textBeforeTag = updatedText.substring(0, lastAtSymbolIndex);
      const textAfterTag = updatedText.substring(caretPosition);
      
      updatedText = `${textBeforeTag}@${userName} ${textAfterTag}`;
      
      if (currentInputField === 'comment') {
        setNewComment(updatedText);
      } else {
        setReplyContent(updatedText);
      }
    }
    
    setShowTagSelector(false);
    
    setTimeout(() => {
      const input = currentInputField === 'comment' ? commentInputRef.current : replyInputRef.current;
      if (input) {
        input.focus();
        const newCursorPosition = lastAtSymbolIndex + userName.length + 2;
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTagSelector &&
        commentInputRef.current &&
        !commentInputRef.current.contains(event.target as Node) &&
        replyInputRef.current &&
        !replyInputRef.current.contains(event.target as Node)
      ) {
        setShowTagSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTagSelector]);

  const extractTaggedUsers = (content: string): string[] => {
    const matches = content.match(/@(\w+\s\w+)/g) || [];
    return matches.map(match => match.substring(1).trim());
  };

  const formatContentWithTags = (content: string) => {
    return content.replace(/@(\w+\s\w+)/g, '<span class="text-primary font-medium">@$1</span>');
  };
  
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    if (!isLoggedIn) {
      toast("Please sign in to post a comment");
      return;
    }
    
    const taggedUsers = extractTaggedUsers(newComment);
    
    const newCommentObj: Comment = {
      id: `${comments.length + 1}`,
      userId: 'current-user',
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
              userId: 'current-user',
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
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="mt-12 relative">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
      
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Join the conversation</h3>
        <div className="relative">
          <Textarea
            ref={commentInputRef}
            value={newComment}
            onChange={(e) => handleInputChange(e, 'comment')}
            placeholder="Share your thoughts... Use @ to tag other users"
            className="mb-3"
          />
          <button
            type="button"
            onClick={() => {
              commentInputRef.current?.focus();
              const currentValue = newComment;
              const newValue = currentValue + '@';
              setNewComment(newValue);
              setCurrentInputField('comment');
              
              if (commentInputRef.current) {
                const rect = commentInputRef.current.getBoundingClientRect();
                setTagSelectorPosition({
                  top: rect.bottom + window.scrollY,
                  left: rect.left
                });
                setShowTagSelector(true);
              }
            }}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            title="Tag a user"
          >
            <AtSign size={16} />
          </button>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </div>
      
      {showTagSelector && (
        <UserTagSelector
          users={availableUsers}
          position={tagSelectorPosition}
          onSelectUser={handleTagUser}
        />
      )}
      
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
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
                    onClick={() => handleLikeComment(comment.id)}
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
                  <div className="mt-4 pl-4 border-l-2 border-gray-100">
                    <div className="relative">
                      <Textarea
                        ref={replyInputRef}
                        value={replyContent}
                        onChange={(e) => handleInputChange(e, 'reply')}
                        placeholder="Write your reply... Use @ to tag other users"
                        className="mb-3"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          replyInputRef.current?.focus();
                          const currentValue = replyContent;
                          const newValue = currentValue + '@';
                          setReplyContent(newValue);
                          setCurrentInputField('reply');
                          
                          if (replyInputRef.current) {
                            const rect = replyInputRef.current.getBoundingClientRect();
                            setTagSelectorPosition({
                              top: rect.bottom + window.scrollY,
                              left: rect.left
                            });
                            setShowTagSelector(true);
                          }
                        }}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        title="Tag a user"
                      >
                        <AtSign size={16} />
                      </button>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim()}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
                
                {comment.replies.length > 0 && (
                  <div className="mt-4 pl-6 space-y-4 border-l border-gray-100">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="bg-gray-50 p-3 rounded">
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
                              onClick={() => handleLikeReply(comment.id, reply.id)}
                              className="text-xs flex items-center text-gray-500 hover:text-primary transition-colors"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {reply.likes} {reply.likes === 1 ? 'Like' : 'Likes'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {comments.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};
