
import React from 'react';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  // Process content to highlight any user tags that might be in the blog post content
  const processedContent = content
    // Replace user tags with styled version
    .replace(/@(\w+\s\w+)/g, '<span class="text-primary font-medium">@$1</span>')
    // Make headings left-aligned
    .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-left">$1</h1>')
    .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-left">$1</h2>')
    .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-left">$1</h3>')
    .replace(/<h4>(.*?)<\/h4>/g, '<h4 class="text-left">$1</h4>')
    // Make paragraphs left-aligned
    .replace(/<p style="text-align: center;">(.*?)<\/p>/g, '<p>$1</p>')
    // Ensure ViaFix is properly written
    .replace(/via-?fix/gi, 'ViaFix')
    .replace(/Via-?Fix/g, 'ViaFix');

  return (
    <div 
      className="prose prose-lg max-w-none text-left"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};
