
import React, { useState } from 'react';
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
import { 
  ChevronLeft, 
  Calendar, 
  Search, 
  BookOpen, 
  Share2, 
  Tag,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;
  const { toast } = useToast();
  
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
      <BlogPostSEO post={post} slug={slug || ''} />

      <article className="min-h-screen">
        <BlogPostHeader post={post} slug={slug || ''} />
        
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 md:p-12 shadow-xl">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {post.date}
                    </span>
                    <span className="hidden sm:inline-flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {Math.ceil(post.content.length / 1000)} min read
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10">
                      {post.category}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-primary"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied to clipboard",
                        description: "You can now share this blog post with others",
                      });
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <BlogPostContent content={post.content} />
              </Card>
            </motion.div>
            
            <div className="mt-12">
              <Card className="overflow-hidden">
                <div className="p-8">
                  <CommentSection postSlug={slug || ''} />
                </div>
              </Card>
            </div>
            
            <BlogPostFooter post={post} slug={slug || ''} blogPosts={blogPosts} />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
