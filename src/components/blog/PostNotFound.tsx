
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';

export const PostNotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-24">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Post not found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to blog
          </Link>
        </div>
      </div>
    </Layout>
  );
};
