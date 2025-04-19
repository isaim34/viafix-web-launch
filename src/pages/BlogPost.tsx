
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { CommentSection } from '@/components/blog/CommentSection';
import { blogPosts as blogPostsData } from '@/data/blogPosts';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { BlogPostFooter } from '@/components/blog/BlogPostFooter';
import { BlogPostSEO } from '@/components/blog/BlogPostSEO';
import { Card } from '@/components/ui/card';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPostsData[slug as keyof typeof blogPostsData] : null;
  
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">
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

      <article className="bg-white">
        {/* Hero and Header */}
        <BlogPostHeader post={post} slug={slug || ''} />
        
        {/* Content section */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 shadow-md">
              {/* Main Content */}
              <BlogPostContent content={post.content} />
            </Card>
            
            {/* Comment section */}
            <div className="mt-8">
              <CommentSection postSlug={slug || ''} />
            </div>
            
            {/* Tags and Related Articles */}
            <BlogPostFooter post={post} slug={slug || ''} blogPosts={blogPostsData} />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
