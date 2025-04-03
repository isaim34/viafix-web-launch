
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Button } from './Button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import blogPosts from '@/data/blogPosts';

// Create an array of the first 3 blog posts for the home page section
const featuredBlogPosts = Object.entries(blogPosts).slice(0, 3).map(([slug, post]) => ({
  id: slug,
  title: post.title,
  excerpt: post.metaDescription,
  image: post.image,
  slug: slug,
  date: post.date,
  author: post.author
}));

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
            <h2 className="text-3xl font-bold mb-4">Austin Auto Repair Insights</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Latest news, tips, and insights about mobile auto repair services and the automotive industry in Austin, TX.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredBlogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="w-full h-48 relative">
                  <AspectRatio ratio={16 / 9} className="bg-gray-100">
                    <img 
                      src={post.image} 
                      alt={`Auto repair ${post.title} in Austin, TX`} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm">
                    Read more <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/blog">
              <Button 
                variant="outline" 
                size="lg"
                icon={<FileText className="w-4 h-4" />}
              >
                View All Austin Auto Repair Articles
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
