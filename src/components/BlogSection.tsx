
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Car, Wrench } from 'lucide-react';
import { Button } from './Button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { blogPosts as blogPostsData } from '@/data/blogPosts';
import { BlogPost } from '@/types/blog';

// Create an array of the featured blog posts for the home page section
// Focus on educational content and platform information
const featuredPostSlugs = [
  'car-maintenance-basics',
  'find-trusted-service-provider', 
  'auto-repair-tips'
];

// Filter out any slugs that don't exist in blogPosts
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
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Auto Service Tips & Resources</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Learn about vehicle maintenance, find service providers, and stay informed about auto care best practices.
            </p>
          </motion.div>
        </div>

        {featuredBlogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredBlogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/blog/${post.slug}`} className="block h-full flex flex-col">
                    <div className="w-full relative">
                      <AspectRatio ratio={16 / 9} className="bg-gray-100">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Car className="w-3 h-3 mr-1" />
                        <span>{post.category}</span>
                      </div>
                      <h3 className="text-xl font-medium mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow text-left">
                        {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
                      </p>
                      <div className="flex items-center text-primary font-medium text-sm mt-auto">
                        Read more <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No featured blog posts available at the moment.</p>
          </div>
        )}

        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/blog">
              <Button 
                variant="outline" 
                size="lg"
                icon={<FileText className="w-4 h-4" />}
              >
                View All Articles
              </Button>
            </Link>
            
            <Link to="/find-service-provider">
              <Button 
                variant="default" 
                size="lg"
                icon={<Wrench className="w-4 h-4" />}
              >
                Find a Service Provider
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
