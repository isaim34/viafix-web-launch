
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
    >
      <Card className="p-8 md:p-12 shadow-xl">
        <PostMetadata post={post} />
        <BlogPostContent content={post.content} />
      </Card>
    </motion.div>
  );
};
