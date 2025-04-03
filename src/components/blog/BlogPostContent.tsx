
import React from 'react';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  // Process content to highlight any user tags that might be in the blog post content
  const processedContent = content
    // Replace user tags with styled version
    .replace(/@(\w+\s\w+)/g, '<span class="text-primary font-medium">@$1</span>');

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};
