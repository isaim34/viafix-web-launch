
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, BookOpen, Calendar, Image } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  const { slug } = useParams<{ slug: string }>();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  
  return (
    <div className="blog-post-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose prose-lg md:prose-xl max-w-none"
      >
        <div className="reading-controls mb-4 flex items-center justify-end space-x-2">
          <span className="text-sm text-gray-500 mr-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-1" /> Reading Size:
          </span>
          <button 
            onClick={() => setFontSize('normal')}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${fontSize === 'normal' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            A
          </button>
          <button 
            onClick={() => setFontSize('large')}
            className={`px-2 py-1 text-sm rounded-md transition-colors ${fontSize === 'large' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            A
          </button>
          <button 
            onClick={() => setFontSize('larger')}
            className={`px-2 py-1 text-base rounded-md transition-colors ${fontSize === 'larger' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            A
          </button>
        </div>
        
        <div 
          className={`blog-content font-${fontSize}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>
      
      <style>
        {`
          .blog-content {
            @apply max-w-[65ch] mx-auto text-gray-700;
          }
          
          .font-normal {
            font-size: 1rem;
          }
          
          .font-large {
            font-size: 1.125rem;
          }
          
          .font-larger {
            font-size: 1.25rem;
          }
        `}
      </style>
    </div>
  );
};
