
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Car, Wrench, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Card } from '@/components/ui/card';
import { blogPosts as blogPostsData } from '@/data/blog';
import { BlogPost } from '@/types/blog';

const featuredPostSlugs = [
  'car-maintenance-basics',
  'find-trusted-service-provider', 
  'auto-repair-tips'
];

const validFeaturedSlugs = featuredPostSlugs.filter(slug => 
  blogPostsData[slug as keyof typeof blogPostsData] !== undefined
);

const featuredBlogPosts = validFeaturedSlugs.map(slug => {
  const post = blogPostsData[slug as keyof typeof blogPostsData] as BlogPost;
  return {
    id: slug,
    title: post.title,
    excerpt: post.metaDescription,
    image: post.image,
    slug: slug,
    date: post.date,
    author: post.author,
    category: post.category
  };
});

export const BlogSection = () => {
  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e0e7ff" fill-opacity="0.3"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Expert Knowledge
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Auto Service Tips & 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600"> Resources</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Learn about vehicle maintenance, find service providers, and stay informed about auto care best practices from industry experts.
            </p>
          </motion.div>
        </div>

        {featuredBlogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredBlogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg group">
                  <Link to={`/blog/${post.slug}`} className="block h-full flex flex-col">
                    {/* Category badge with gradient */}
                    <div className="p-6 pb-4">
                      <div className="inline-flex items-center bg-gradient-to-r from-primary to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium mb-4">
                        <Car className="w-3 h-3 mr-1.5" />
                        {post.category}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                        {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {post.date} • {post.author}
                        </div>
                        <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                          Read more <ArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-gray-500">No featured blog posts available at the moment.</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 inline-block shadow-lg border border-white/20"
          >
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/blog">
                <Button 
                  variant="outline" 
                  size="lg"
                  icon={<FileText className="w-4 h-4" />}
                  className="bg-white/80 hover:bg-white border-gray-200 hover:border-primary/30 shadow-sm"
                >
                  View All Articles
                </Button>
              </Link>
              
              <Link to="/mechanics">
                <Button 
                  variant="default" 
                  size="lg"
                  icon={<Wrench className="w-4 h-4" />}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all"
                >
                  Find a Service Provider
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
