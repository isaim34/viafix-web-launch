
import React from 'react';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  // Process content to highlight any user tags that might be in the blog post content
  const processedContent = content
    // Replace user tags with styled version
    .replace(/@(\w+\s\w+)/g, '<span class="text-primary font-medium">@$1</span>')
    // Make headings styled consistently
    .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-3xl font-bold mb-6 mt-8 text-left">$1</h1>')
    .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-2xl font-bold mb-4 mt-6 text-left">$1</h2>')
    .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-xl font-bold mb-3 mt-5 text-left">$1</h3>')
    .replace(/<h4>(.*?)<\/h4>/g, '<h4 class="text-lg font-bold mb-2 mt-4 text-left">$1</h4>')
    // Make paragraphs properly styled
    .replace(/<p style="text-align: center;">(.*?)<\/p>/g, '<p class="mb-4 text-gray-700">$1</p>')
    .replace(/<p>(.*?)<\/p>/g, '<p class="mb-4 text-gray-700">$1</p>')
    // Style lists
    .replace(/<ul>(.*?)<\/ul>/g, '<ul class="list-disc pl-5 mb-4 text-gray-700">$1</ul>')
    .replace(/<ol>(.*?)<\/ol>/g, '<ol class="list-decimal pl-5 mb-4 text-gray-700">$1</ol>')
    .replace(/<li>(.*?)<\/li>/g, '<li class="mb-2">$1</li>')
    // Add styling to links
    .replace(/<a(.*?)>(.*?)<\/a>/g, '<a$1 class="text-primary hover:underline">$2</a>')
    // Ensure ViaFix is properly written
    .replace(/via-?fix/gi, 'ViaFix')
    .replace(/Via-?Fix/g, 'ViaFix')
    // Style blockquotes
    .replace(/<blockquote>(.*?)<\/blockquote>/g, '<blockquote class="pl-4 border-l-4 border-primary italic my-4 text-gray-600">$1</blockquote>');

  return (
    <div 
      className="prose prose-lg max-w-none text-left"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};
