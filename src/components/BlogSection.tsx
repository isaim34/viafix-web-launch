import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Calendar, User, ShieldCheck, Tag } from 'lucide-react';
import { Button } from './Button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
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
                        alt={`${post.title} - Auto repair in Austin, TX`} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
                        <Tag className="w-3 h-3 mr-1" />
                        {post.category}
                      </span>
                    </div>
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
                View All Austin Auto Repair Articles
              </Button>
            </Link>
            
            <Link to="/vehicle-safety-check">
              <Button 
                variant="default" 
                size="lg"
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                Check Your Vehicle Safety
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
