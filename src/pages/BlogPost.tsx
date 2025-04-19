
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
  ChevronRight,
  Calendar, 
  Search, 
  BookOpen, 
  Share2, 
  Tag,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Get related posts - 3 random posts that aren't the current one
  const getRelatedPosts = () => {
    if (!slug) return [];
    
    return Object.entries(blogPosts)
      .filter(([key]) => key !== slug)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(([key, post]) => ({
        slug: key,
        title: post.title,
        image: post.image,
        date: post.date,
      }));
  };
  
  const relatedPosts = getRelatedPosts();
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.metaDescription,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this blog post with others",
      });
    }
  };
  
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

      <article className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <BlogPostHeader post={post} slug={slug || ''} />
        
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content column */}
            <div className="flex-grow max-w-4xl mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 md:p-12 shadow-xl bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {post.date}
                      </span>
                      <span className="hidden sm:inline-flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {Math.ceil(post.content.length / 1000)} min read
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-primary"
                      onClick={handleShareClick}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <BlogPostContent content={post.content} />
                  
                  {/* Tags section within content */}
                  <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-100">
                    <span className="text-sm font-medium flex items-center">
                      <Tag className="w-4 h-4 mr-2" /> Tags:
                    </span>
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
              
              <div className="mt-12">
                <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
                  <div className="p-8">
                    <CommentSection postSlug={slug || ''} />
                  </div>
                </Card>
              </div>
              
              <BlogPostFooter post={post} slug={slug || ''} blogPosts={blogPosts} />
            </div>
            
            {/* Sidebar column */}
            <div className={cn(
              "lg:w-80 xl:w-96 shrink-0 transition-all duration-300",
              sidebarCollapsed ? "lg:w-0 lg:overflow-hidden" : ""
            )}>
              <div className="sticky top-24">
                <Collapsible 
                  open={!sidebarCollapsed} 
                  onOpenChange={(open) => setSidebarCollapsed(!open)}
                  className="lg:hidden mb-6"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      {sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pt-4">
                      {/* Mobile sidebar content */}
                      <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold mb-4">Search Posts</h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            placeholder="Search blog posts..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </Card>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                {/* Desktop sidebar - always visible on desktop unless collapsed */}
                <div className="hidden lg:block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mb-4" 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    {sidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  
                  <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Search Posts</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search blog posts..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </Card>
                  
                  <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost, index) => (
                        <div key={index} className="group">
                          <Link to={`/blog/${relatedPost.slug}`} className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                            <div className="w-16 h-16 shrink-0 overflow-hidden rounded-md">
                              <AspectRatio ratio={1/1}>
                                <img 
                                  src={relatedPost.image} 
                                  alt={relatedPost.title}
                                  className="object-cover w-full h-full"
                                />
                              </AspectRatio>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">{relatedPost.date}</p>
                            </div>
                          </Link>
                        </div>
                      ))}
                      
                      <Link 
                        to="/blog" 
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-2"
                      >
                        View all articles
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-2">Need help with your vehicle?</h3>
                    <p className="text-sm text-gray-600 mb-4">Connect with ASE-certified mechanics ready to help with your auto repair needs.</p>
                    <Link to="/mechanics">
                      <Button size="sm" className="w-full">Find a Mechanic</Button>
                    </Link>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
