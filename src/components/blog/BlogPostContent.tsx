
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
      >
        <div className="reading-controls mb-6 flex items-center justify-end space-x-2 border-b pb-4">
          <span className="text-sm text-gray-500 mr-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-1" /> Reading Size:
          </span>
          <button 
            onClick={() => setFontSize('normal')}
            className={`px-2 py-1 text-xs rounded-md transition-all duration-200 ${
              fontSize === 'normal' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            A
          </button>
          <button 
            onClick={() => setFontSize('large')}
            className={`px-2 py-1 text-sm rounded-md transition-all duration-200 ${
              fontSize === 'large' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            A
          </button>
          <button 
            onClick={() => setFontSize('larger')}
            className={`px-2 py-1 text-base rounded-md transition-all duration-200 ${
              fontSize === 'larger' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            A
          </button>
        </div>
        
        <div 
          className={`blog-content font-${fontSize} prose prose-lg md:prose-xl max-w-none`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>
      
      <style>
        {`
          .blog-content {
            @apply max-w-[65ch] mx-auto text-gray-700 leading-relaxed;
          }
          
          .blog-content h2 {
            @apply text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4;
          }
          
          .blog-content h3 {
            @apply text-xl md:text-2xl font-semibold text-gray-800 mt-6 mb-3;
          }
          
          .blog-content p {
            @apply mb-6;
          }
          
          .blog-content ul, .blog-content ol {
            @apply my-6 pl-6;
          }
          
          .blog-content li {
            @apply mb-2;
          }
          
          .blog-content img {
            @apply rounded-lg shadow-lg my-8 hover:shadow-xl transition-shadow duration-300;
          }
          
          .blog-content blockquote {
            @apply border-l-4 border-primary pl-4 italic my-6 text-gray-600;
          }
          
          .font-normal {
            font-size: 1rem;
            line-height: 1.75;
          }
          
          .font-large {
            font-size: 1.125rem;
            line-height: 1.8;
          }
          
          .font-larger {
            font-size: 1.25rem;
            line-height: 1.85;
          }
          
          .blog-content a {
            @apply text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-2 hover:underline;
          }
          
          @media (max-width: 768px) {
            .blog-content {
              @apply px-4;
            }
          }
        `}
      </style>
    </div>
  );
};
