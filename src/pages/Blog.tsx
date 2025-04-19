
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Search, Tag } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { blogPosts as blogPostsData } from '@/data/blog';
import { BlogPost } from '@/types/blog';

// Convert the blog posts object to an array for easier rendering
const blogPostsArray = Object.entries(blogPostsData).map(([slug, post]) => ({
  id: slug,
  title: (post as BlogPost).title,
  excerpt: (post as BlogPost).metaDescription,
  image: (post as BlogPost).image,
  slug: slug,
  date: (post as BlogPost).date,
  author: (post as BlogPost).author,
  category: (post as BlogPost).category
}));

// Get unique categories from blog posts
const categories = ['All', ...new Set(blogPostsArray.map(post => post.category))];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter blog posts based on search term and category
  const filteredPosts = blogPostsArray.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Helmet>
        <title>Auto Repair Blog | ViaFix | Austin, TX</title>
        <meta name="description" content="Expert auto repair advice, mechanic insights, and industry trends for Austin drivers. Learn about mobile mechanic services and gig-based auto repair." />
        <meta name="keywords" content="auto repair blog, ASE-certified mechanics, mobile auto repair austin, gig-based auto repair, car maintenance tips" />
        <link rel="canonical" href="https://tryviafix.com/blog" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
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
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                      selectedCategory === category 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No articles match your search criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                      <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
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
                          <p className="text-gray-600 text-sm mb-4 flex-grow text-left">
                            {post.excerpt.length > 150 ? `${post.excerpt.substring(0, 150)}...` : post.excerpt}
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
            )}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">Looking for more auto repair information?</p>
            <Link to="/" className="text-primary hover:underline font-medium inline-flex items-center mt-2">
              Find a mechanic near you <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
