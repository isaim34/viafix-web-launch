import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Car } from 'lucide-react';
import { Button } from './Button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import blogPosts from '@/data/blogPosts';

// Check which blog posts are actually available
console.log('Available blog posts:', Object.keys(blogPosts));

// Create an array of the featured blog posts for the home page section
// Focus on educational content and platform information
// Making sure we only use slugs that exist in the blogPosts object
const availableBlogPostSlugs = Object.keys(blogPosts);
const desiredFeaturedSlugs = [
  'car-maintenance-basics',
  'find-trusted-service-provider', 
  'auto-repair-tips'
];

// Filter to only include slugs that actually exist in blogPosts
const featuredPostSlugs = desiredFeaturedSlugs.filter(slug => 
  availableBlogPostSlugs.includes(slug)
);

// If we don't have any matching slugs, use the first few available posts
const finalFeaturedPostSlugs = featuredPostSlugs.length > 0 
  ? featuredPostSlugs 
  : availableBlogPostSlugs.slice(0, 3);

const featuredBlogPosts = finalFeaturedPostSlugs.map(slug => ({
  id: slug,
  title: blogPosts[slug].title,
  excerpt: blogPosts[slug].metaDescription,
  image: blogPosts[slug].image,
  slug: slug,
  date: blogPosts[slug].date,
  author: blogPosts[slug].author,
  category: blogPosts[slug].category
}));

export const BlogSection = () => {
  return (
    <section id="blog" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Auto Service Tips & Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Learn about vehicle maintenance, find service providers, and stay informed about auto care best practices.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredBlogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`}>
                <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-transparent hover:border-primary/20">
                  <div className="w-full relative">
                    <AspectRatio ratio={16 / 9}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </AspectRatio>
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-foreground bg-primary/90 backdrop-blur-sm rounded-full">
                        <Car className="w-3 h-3 mr-1" />
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <span className="inline-flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Read more <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 items-center"
        >
          <Link to="/blog">
            <Button 
              variant="outline" 
              size="lg"
              className="min-w-[200px] bg-white hover:bg-gray-50"
            >
              View All Articles
            </Button>
          </Link>
          
          <Link to="/find-service-provider">
            <Button 
              variant="default" 
              size="lg"
              className="min-w-[200px]"
            >
              Find a Service Provider
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
