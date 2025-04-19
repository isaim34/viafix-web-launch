import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { CommentSection } from '@/components/blog/CommentSection';
import blogPosts from '@/data/blogPosts';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { BlogPostFooter } from '@/components/blog/BlogPostFooter';
import { BlogPostSEO } from '@/components/blog/BlogPostSEO';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Calendar } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log("Current blog post slug:", slug);
  const post = slug ? blogPosts[slug] : null;
  console.log("Found blog post:", post);
  
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Post not found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* SEO Setup */}
      <BlogPostSEO post={post} slug={slug || ''} />

      <article className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        {/* Hero and Header */}
        <BlogPostHeader post={post} slug={slug || ''} />
        
        {/* Content section */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 md:p-12 shadow-xl bg-white/80 backdrop-blur-sm">
                {/* Reading time and date info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {post.date}
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <BlogPostContent content={post.content} />
              </Card>
            </motion.div>
            
            {/* Comment section with updated styling */}
            <div className="mt-12">
              <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
                <div className="p-8">
                  <CommentSection postSlug={slug || ''} />
                </div>
              </Card>
            </div>
            
            {/* Tags and Related Articles */}
            <BlogPostFooter post={post} slug={slug || ''} blogPosts={blogPosts} />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
