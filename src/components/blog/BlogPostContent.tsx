
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
  
  // Different style themes based on blog post slug
  const getThemeStyles = () => {
    if (!slug) return {};
    
    const themes: Record<string, any> = {
      'car-maintenance-basics': {
        headingClass: 'text-blue-600 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent',
        accentColor: 'border-blue-400',
        quoteStyle: 'bg-blue-50',
        imageStyle: 'ring-2 ring-blue-200'
      },
      'how-to-change-oil': {
        headingClass: 'text-amber-600 bg-gradient-to-r from-amber-500 to-red-400 bg-clip-text text-transparent',
        accentColor: 'border-amber-400',
        quoteStyle: 'bg-amber-50',
        imageStyle: 'ring-2 ring-amber-200'
      },
      'diagnosing-engine-problems': {
        headingClass: 'text-red-600 bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent',
        accentColor: 'border-red-400',
        quoteStyle: 'bg-red-50',
        imageStyle: 'ring-2 ring-red-200'
      },
      'best-car-batteries': {
        headingClass: 'text-purple-600 bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent',
        accentColor: 'border-purple-400',
        quoteStyle: 'bg-purple-50',
        imageStyle: 'ring-2 ring-purple-200'
      },
      'wheel-alignment': {
        headingClass: 'text-green-600 bg-gradient-to-r from-green-500 to-teal-400 bg-clip-text text-transparent',
        accentColor: 'border-green-400',
        quoteStyle: 'bg-green-50',
        imageStyle: 'ring-2 ring-green-200'
      }
    };
    
    // Default to the first theme if the slug doesn't match any defined themes
    return themes[slug] || Object.values(themes)[0];
  };
  
  const theme = getThemeStyles();
  
  // Function to enhance content with special formatting and pull quotes
  const enhanceContent = (htmlContent: string) => {
    // Add pull quotes using a special marker in the content
    // Format: <!-- PULLQUOTE: Your quote text here -->
    const pullQuoteRegex = /<!-- PULLQUOTE: (.*?) -->/g;
    
    const withPullQuotes = htmlContent.replace(pullQuoteRegex, (match, quote) => {
      return `
        <div class="my-8 md:my-12 px-6 py-4 md:px-8 md:py-6 border-l-4 ${theme.accentColor || 'border-primary/70'} ${theme.quoteStyle || 'bg-primary/5'} rounded-r-lg transition-all duration-300 hover:shadow-md">
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
    
    // Add first letter styling
    const addFirstLetterStyling = withPullQuotes.replace(
      /<p>(.*?)<\/p>/g, 
      (match, content) => {
        if (content.length > 100) {
          const firstChar = content.charAt(0);
          const rest = content.slice(1);
          return `<p><span class="first-letter">${firstChar}</span>${rest}</p>`;
        }
        return match;
      }
    );
    
    // Add image captions
    const withImageCaptions = addFirstLetterStyling.replace(
      /<img src="(.*?)" alt="(.*?)">/g,
      (match, src, alt) => {
        return `
          <figure class="my-8 overflow-hidden rounded-xl ${theme.imageStyle || ''}">
            <img src="${src}" alt="${alt}" class="w-full transition-transform duration-500 hover:scale-105">
            <figcaption class="image-caption py-2 px-4 text-center text-sm text-gray-500 italic">${alt}</figcaption>
          </figure>
        `;
      }
    );
    
    // Enhance headings with gradient text
    const enhanceHeadings = withImageCaptions
      .replace(/<h2>(.*?)<\/h2>/g, `<h2 class="${theme.headingClass || 'gradient-heading'}">$1</h2>`)
      .replace(/<h3>(.*?)<\/h3>/g, `<h3 class="${theme.headingClass || 'gradient-heading-secondary'}">$1</h3>`);
    
    // Add key point highlights
    const withKeyPoints = enhanceHeadings.replace(
      /<!-- KEYPOINT: (.*?) -->/g,
      (match, point) => {
        return `
          <div class="key-point flex items-start my-6 px-4 py-3 rounded-lg" role="note">
            <div class="flex-shrink-0 mr-3 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-base font-medium">${point}</p>
            </div>
          </div>
        `;
      }
    );
    
    // Add expandable sections
    const withExpandableSections = withKeyPoints.replace(
      /<!-- EXPAND_START: (.*?) -->([\s\S]*?)<!-- EXPAND_END -->/g,
      (match, title, content) => {
        const uniqueId = `expand-${Math.random().toString(36).substring(2, 9)}`;
        return `
          <div class="expandable-section my-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-left"
              onclick="document.getElementById('${uniqueId}').classList.toggle('hidden'); this.querySelector('svg').classList.toggle('rotate-180');"
            >
              ${title}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div id="${uniqueId}" class="hidden p-4 border-t border-gray-200">
              ${content}
            </div>
          </div>
        `;
      }
    );
    
    return withExpandableSections;
  };

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
          dangerouslySetInnerHTML={{ __html: enhanceContent(content) }}
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
          
          .blog-content h1 {
            @apply text-4xl md:text-5xl font-bold mb-8 tracking-tight;
          }
          
          .blog-content h2 {
            @apply text-3xl font-semibold mb-6 mt-12 text-gray-800 border-b pb-2;
          }
          
          .blog-content p {
            @apply leading-relaxed mb-6 text-gray-600;
            font-feature-settings: "liga" 1, "kern" 1;
          }
          
          .blog-content .first-letter {
            @apply float-left text-7xl font-bold mr-3 mt-1;
            line-height: 0.8;
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
            @apply rounded-xl my-8 hover:shadow-xl transition-all duration-300 max-w-full h-auto;
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
          
          /* Key point highlights */
          .key-point {
            @apply bg-primary/10 border border-primary/20;
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
            .blog-content .first-letter {
              @apply text-5xl;
            }
          }
        `}
      </style>
    </div>
  );
};
