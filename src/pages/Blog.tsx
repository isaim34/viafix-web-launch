
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Helmet } from 'react-helmet-async';

const blogPosts = [
  {
    id: 1,
    title: 'Why Independent Mechanics Choose ViaFix in Austin',
    excerpt: 'Discover why ASE-certified mechanics across Austin are joining the ViaFix platform for flexible gig-based work opportunities and how it's revolutionizing auto repair services in Texas.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    slug: 'why-independent-mechanics-choose-viafix',
    date: 'April 2, 2025',
    author: 'Michael Rodriguez',
    category: 'Mechanic Insights'
  },
  {
    id: 2,
    title: 'Top 5 Auto Repair Services in Austin, TX',
    excerpt: 'From engine diagnostics to brake repairs, these are the most requested mobile mechanic services in the Austin area. Learn what vehicle issues Austin residents commonly face.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    slug: 'top-auto-repair-services-austin',
    date: 'March 28, 2025',
    author: 'Sarah Johnson',
    category: 'Auto Repair Tips'
  },
  {
    id: 3,
    title: 'How ViaFix Ensures Quality Auto Repairs in Austin',
    excerpt: 'Learn about our rigorous vetting process for mechanics and how we maintain high standards for all mobile repairs in Austin. Quality service is our priority.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    slug: 'how-viafix-ensures-quality-repairs',
    date: 'March 21, 2025',
    author: 'David Chen',
    category: 'Quality Assurance'
  },
  {
    id: 4,
    title: 'The Rise of Mobile Mechanics in Austin's Gig Economy',
    excerpt: 'How the gig economy is transforming auto repair services in Austin, with mobile mechanics leading the change for convenient, on-demand vehicle repairs.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    slug: 'rise-of-mobile-mechanics-austin-gig-economy',
    date: 'March 15, 2025',
    author: 'Lisa Wang',
    category: 'Industry Trends'
  },
  {
    id: 5,
    title: 'Benefits of ASE Certification for Austin Auto Mechanics',
    excerpt: 'Why ASE certification matters for mechanics and customers alike. Discover how certified professionals on ViaFix provide superior auto repair services in Austin.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    slug: 'benefits-ase-certification-austin-mechanics',
    date: 'March 8, 2025',
    author: 'James Wilson',
    category: 'Professional Development'
  },
  {
    id: 6,
    title: 'Seasonal Car Maintenance Tips for Austin Drivers',
    excerpt: 'Essential maintenance tasks to keep your vehicle running smoothly through Austin's hot summers and mild winters. Preventative care from mobile mechanics.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    slug: 'seasonal-car-maintenance-austin-drivers',
    date: 'March 1, 2025',
    author: 'Emily Rodriguez',
    category: 'Maintenance Tips'
  }
];

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
            {blogPosts.map((post, index) => (
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
