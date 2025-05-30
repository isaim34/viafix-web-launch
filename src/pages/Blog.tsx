
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Search, Tag, Sparkles } from 'lucide-react';
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
      
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="container mx-auto px-4 sm:px-6 py-16 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Expert Knowledge
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Austin Auto Repair 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600"> Insights</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`px-4 py-3 rounded-xl text-sm whitespace-nowrap font-medium transition-all ${
                        selectedCategory === category 
                          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg' 
                          : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:border-primary/30 shadow-sm'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                    <p className="text-gray-600">No articles match your search criteria. Try adjusting your filters.</p>
                  </div>
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
                      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg group">
                        <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                          <div className="p-6 flex-grow flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="inline-flex items-center bg-gradient-to-r from-primary to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">
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
                            <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors leading-tight">
                              {post.title}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4 flex-grow text-left leading-relaxed">
                              {post.excerpt.length > 150 ? `${post.excerpt.substring(0, 150)}...` : post.excerpt}
                            </p>
                            <div className="flex items-center text-primary font-semibold text-sm mt-auto group-hover:translate-x-1 transition-transform">
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
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-lg border border-white/20">
                <p className="text-gray-600 mb-4">Looking for more auto repair information?</p>
                <Link to="/" className="text-primary hover:underline font-medium inline-flex items-center">
                  Find a mechanic near you <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
