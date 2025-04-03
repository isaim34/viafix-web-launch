
import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { ChevronLeft, Share2 } from 'lucide-react';
import { BlogPost } from '@/data/blogPosts';

interface BlogPostHeaderProps {
  post: BlogPost;
  slug: string;
}

export const BlogPostHeader = ({ post, slug }: BlogPostHeaderProps) => {
  return (
    <>
      {/* Hero section */}
      <div 
        className="w-full h-[400px] relative bg-cover bg-center"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="max-w-3xl">
              <div className="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                {post.category}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-white/80 text-sm mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <User className="w-4 h-4 mr-1" />
                <span>{post.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/blog">
          <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-4 h-4" />}>
            Back to Blog
          </Button>
        </Link>
        <Button variant="ghost" size="sm" icon={<Share2 className="w-4 h-4" />}>
          Share
        </Button>
      </div>
    </>
  );
};
