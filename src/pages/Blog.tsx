
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Helmet } from 'react-helmet-async';
import blogPosts from '@/data/blogPosts';

// Convert the blog posts object to an array for easier rendering
const blogPostsArray = Object.entries(blogPosts).map(([slug, post]) => ({
  id: slug,
  title: post.title,
  excerpt: post.metaDescription,
  image: post.image,
  slug: slug,
  date: post.date,
  author: post.author,
  category: post.category
}));

const Blog = () => {
  return (
    <Layout>
      <Helmet>
        <title>Auto Repair Blog | ViaFix | Austin, TX</title>
        <meta name="description" content="Expert auto repair advice, mechanic insights, and industry trends for Austin drivers. Learn about mobile mechanic services and gig-based auto repair." />
        <meta name="keywords" content="auto repair blog, ASE-certified mechanics, mobile auto repair austin, gig-based auto repair, car maintenance tips" />
        <link rel="canonical" href="https://tryviafix.com/blog" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Austin Auto Repair Insights</h1>
            <p className="text-gray-600 text-lg">
              Expert advice, industry insights, and helpful tips about auto repair services in Austin, TX.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {blogPostsArray.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
              >
                <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
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
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <h2 className="text-xl font-medium mb-3 hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm mt-auto">
                      Read more <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
