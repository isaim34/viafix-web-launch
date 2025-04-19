
import React from 'react';
import { motion } from 'framer-motion';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="prose prose-lg md:prose-xl max-w-none"
    >
      <div className="blog-content">
        <style>
          {`
            .blog-content {
              @apply max-w-[65ch] mx-auto text-gray-700;
            }
            
            .blog-content h1 {
              @apply text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-tight;
            }
            
            .blog-content h2 {
              @apply text-3xl font-semibold mb-6 mt-12 text-gray-800 border-b pb-2;
            }
            
            .blog-content p {
              @apply text-lg leading-relaxed mb-6 text-gray-600;
              font-feature-settings: "liga" 1, "kern" 1;
            }
            
            .blog-content ul {
              @apply space-y-4 my-8 ml-6;
            }
            
            .blog-content li {
              @apply relative pl-6 text-gray-600;
            }
            
            .blog-content li:before {
              content: "";
              @apply absolute left-0 top-[0.6em] w-2 h-2 bg-primary/60 rounded-full;
            }
            
            .blog-content strong {
              @apply text-gray-900 font-semibold;
            }
            
            .blog-content blockquote {
              @apply pl-6 border-l-4 border-primary/30 italic text-gray-700 my-8;
            }
            
            .blog-content a {
              @apply text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors;
            }

            .blog-content img {
              @apply rounded-xl shadow-lg my-8;
            }
            
            .blog-content code {
              @apply px-2 py-1 bg-gray-100 rounded text-sm text-gray-800;
            }
          `}
        </style>
        <div 
          className="mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </motion.div>
  );
};
