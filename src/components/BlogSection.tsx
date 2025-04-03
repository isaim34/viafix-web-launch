
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Button } from './Button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const blogPosts = [
  {
    id: 1,
    title: 'Why Independent Mechanics Choose ViaFix in Austin',
    excerpt: 'Discover why ASE-certified mechanics across Austin are joining the ViaFix platform for flexible gig-based work opportunities.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    slug: 'why-independent-mechanics-choose-viafix',
    date: 'April 2, 2025',
    author: 'Michael Rodriguez'
  },
  {
    id: 2,
    title: 'Top 5 Auto Repair Services in Austin, TX',
    excerpt: 'From engine diagnostics to brake repairs, these are the most requested mobile mechanic services in the Austin area.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    slug: 'top-auto-repair-services-austin',
    date: 'March 28, 2025',
    author: 'Sarah Johnson'
  },
  {
    id: 3,
    title: 'How ViaFix Ensures Quality Auto Repairs in Austin',
    excerpt: 'Learn about our rigorous vetting process for mechanics and how we maintain high standards for all mobile repairs.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    slug: 'how-viafix-ensures-quality-repairs',
    date: 'March 21, 2025',
    author: 'David Chen'
  }
];

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
          {blogPosts.map((post, index) => (
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
