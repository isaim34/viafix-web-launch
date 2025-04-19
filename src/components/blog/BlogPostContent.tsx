
import React from 'react';
import { Card } from '@/components/ui/card';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  const processedContent = content
    // Style the main title (h1)
    .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-4xl font-bold mb-8 mt-8 text-primary-foreground bg-primary px-6 py-4 rounded-lg shadow-lg text-center">$1</h1>')
    
    // Style section headings (h2)
    .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-2xl font-bold mb-6 mt-8 text-primary border-b-2 border-primary pb-2">$1</h2>')
    
    // Style subsection headings (h3)
    .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-xl font-semibold mb-4 mt-6 text-gray-800">$1</h3>')
    
    // Style paragraphs with better spacing and line height
    .replace(/<p>(.*?)<\/p>/g, '<p class="mb-6 text-gray-700 leading-relaxed">$1</p>')
    
    // Style lists with custom bullets and spacing
    .replace(/<ul>(.*?)<\/ul>/g, '<ul class="mb-6 space-y-2">$1</ul>')
    .replace(/<li>(.*?)<\/li>/g, '<li class="flex items-start space-x-2"><span class="text-primary mt-1.5">•</span><span>$1</span></li>')
    
    // Make blockquotes stand out
    .replace(/<blockquote>(.*?)<\/blockquote>/g, '<blockquote class="my-8 pl-6 border-l-4 border-primary bg-primary/5 py-4 px-4 rounded-r-lg italic text-gray-700">$1</blockquote>')
    
    // Style strong elements
    .replace(/<strong>(.*?)<\/strong>/g, '<strong class="text-primary font-semibold">$1</strong>')
    
    // Add a special highlight class for key points
    .replace(/Key Point:(.*?)(?=<\/p>|<br>)/g, '<span class="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">Key Point:$1</span>')
    
    // Style nested lists
    .replace(/<ul>\s*<li><strong>(.*?)<\/strong>\s*<ul>/g, '<div class="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm"><h4 class="font-semibold text-primary mb-3">$1</h4><ul class="space-y-2">')
    .replace(/<\/ul>\s*<\/li>\s*<\/ul>/g, '</ul></div>')
    
    // Add special styling for ViaFix sections
    .replace(/<h2>How ViaFix Can Help<\/h2>/g, '<h2 class="text-2xl font-bold mb-6 mt-8 bg-primary/10 text-primary px-6 py-4 rounded-lg">How ViaFix Can Help</h2>')
    
    // Style any remaining lists
    .replace(/<ol>(.*?)<\/ol>/g, '<ol class="list-decimal pl-5 mb-6 space-y-2">$1</ol>');

  return (
    <div className="prose prose-lg max-w-none">
      <Card className="p-8 shadow-lg">
        <div 
          className="prose max-w-none text-left"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </Card>
    </div>
  );
};
