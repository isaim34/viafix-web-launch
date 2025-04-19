
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CommentSection } from '@/components/blog/CommentSection';
import blogPosts from '@/data/blogPosts';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostFooter } from '@/components/blog/BlogPostFooter';
import { BlogPostSEO } from '@/components/blog/BlogPostSEO';
import { Card } from '@/components/ui/card';
import { PostNotFound } from '@/components/blog/PostNotFound';
import { PostContainer } from '@/components/blog/PostContainer';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;
  
  if (!post) {
    return <PostNotFound />;
  }

  return (
    <Layout>
      <BlogPostSEO post={post} slug={slug || ''} />
      
      <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <BlogPostHeader post={post} slug={slug || ''} />
        
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <PostContainer post={post} />
            
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
                <div className="p-8">
                  <CommentSection postSlug={slug || ''} />
                </div>
              </Card>
            </motion.div>
            
            <BlogPostFooter post={post} slug={slug || ''} blogPosts={blogPosts} />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
