
import React from 'react';
import { Calendar, BookOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/data/blogPosts';

interface PostMetadataProps {
  post: BlogPost;
}

export const PostMetadata = ({ post }: PostMetadataProps) => {
  const { toast } = useToast();
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this blog post with others",
    });
  };

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {post.date}
        </span>
        <span className="hidden sm:inline-flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          {Math.ceil(post.content.length / 1000)} min read
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10">
          {post.category}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-500 hover:text-primary"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
    </div>
  );
};
