
import React from 'react';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
