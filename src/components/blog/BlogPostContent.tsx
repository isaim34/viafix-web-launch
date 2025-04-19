
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
        <style jsx global>{`
          .blog-content h1 {
            @apply text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight;
          }
          .blog-content h2 {
            @apply text-3xl font-semibold mb-6 mt-12 text-gray-800;
          }
          .blog-content p {
            @apply text-gray-600 leading-relaxed mb-6 text-lg;
          }
          .blog-content ul {
            @apply space-y-4 my-8;
          }
          .blog-content li {
            @apply flex items-start space-x-3 text-gray-600;
          }
          .blog-content li:before {
            content: "•";
            @apply text-primary font-bold mr-2;
          }
          .blog-content strong {
            @apply text-gray-900 font-semibold;
          }
          .blog-content ul li {
            @apply pl-4 -indent-4;
          }
        `}</style>
        <div 
          className="mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </motion.div>
  );
};
