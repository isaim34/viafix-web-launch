
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = ({ content }: BlogPostContentProps) => {
  // Function to enhance content with special formatting and pull quotes
  const enhanceContent = (htmlContent: string) => {
    // Add pull quotes using a special marker in the content
    // Format: <!-- PULLQUOTE: Your quote text here -->
    const pullQuoteRegex = /<!-- PULLQUOTE: (.*?) -->/g;
    
    const withPullQuotes = htmlContent.replace(pullQuoteRegex, (match, quote) => {
      return `
        <div class="my-8 md:my-12 px-6 py-4 md:px-8 md:py-6 border-l-4 border-primary/70 bg-primary/5 rounded-r-lg">
          <div class="flex items-start">
            <span class="text-primary opacity-50 mr-4 mt-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
              </svg>
            </span>
            <p class="text-lg md:text-xl italic font-light text-gray-700 leading-relaxed">${quote}</p>
          </div>
        </div>
      `;
    });
    
    // Enhance headings with gradient text
    const enhanceHeadings = withPullQuotes
      .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="gradient-heading">$1</h2>')
      .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="gradient-heading-secondary">$1</h3>');
    
    return enhanceHeadings;
  };

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
              @apply rounded-xl shadow-lg my-8 hover:shadow-xl transition-all duration-300;
            }
            
            .blog-content code {
              @apply px-2 py-1 bg-gray-100 rounded text-sm text-gray-800;
            }
            
            /* Gradient headings */
            .gradient-heading {
              @apply font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent;
            }
            
            .gradient-heading-secondary {
              @apply font-semibold text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-primary bg-clip-text text-transparent;
            }
            
            /* Pull quote enhancements */
            .pull-quote {
              @apply my-8 px-6 py-4 border-l-4 border-primary/70 bg-primary/5 rounded-r-lg;
            }
            
            /* Image captions */
            .image-caption {
              @apply -mt-6 mb-8 text-sm text-center text-gray-500 italic;
            }
            
            /* Key point highlights */
            .key-point {
              @apply bg-primary/10 px-4 py-3 rounded-lg border border-primary/20 my-6;
            }
            
            /* Responsive improvements */
            @media (max-width: 640px) {
              .blog-content h1 {
                @apply text-3xl;
              }
              .blog-content h2 {
                @apply text-2xl;
              }
              .blog-content p {
                @apply text-base;
              }
            }
          `}
        </style>
        <div 
          className="mx-auto"
          dangerouslySetInnerHTML={{ __html: enhanceContent(content) }}
        />
      </div>
    </motion.div>
  );
};
