
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Calendar, User } from 'lucide-react';
import { Button } from './Button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import blogPosts from '@/data/blogPosts';

// Create an array of the featured blog posts for the home page section
// Pick posts that highlight benefits for both mechanics and customers
const featuredPostSlugs = [
  'why-independent-mechanics-choose-viafix',
  'revolutionizing-auto-repair', 
  'viafix-multiple-markets'
];

const featuredBlogPosts = featuredPostSlugs.map(slug => ({
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link to={`/blog/${post.slug}`} className="block h-full flex flex-col">
                <div className="w-full relative">
                  <AspectRatio ratio={16 / 9} className="bg-gray-100">
                    <img 
                      src={post.image} 
                      alt={`${post.title} - Auto repair in Austin, TX`} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <User className="w-3 h-3 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm mt-auto">
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
