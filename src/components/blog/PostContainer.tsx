
import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/data/blogPosts';
import { Card } from '@/components/ui/card';
import { PostMetadata } from './PostMetadata';
import { BlogPostContent } from './BlogPostContent';

interface PostContainerProps {
  post: BlogPost;
}

export const PostContainer = ({ post }: PostContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
      <Card className="relative p-8 md:p-12 shadow-xl bg-white/80 backdrop-blur-sm">
        <PostMetadata post={post} />
        <BlogPostContent content={post.content} />
      </Card>
    </motion.div>
  );
};
