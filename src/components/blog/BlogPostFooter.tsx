
import React from 'react';
import { Tag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Card } from '@/components/ui/card';
import { BlogPost, BlogPostsCollection } from '@/data/blogPosts';

interface BlogPostFooterProps {
  post: BlogPost;
  slug: string;
  blogPosts: BlogPostsCollection;
}

export const BlogPostFooter = ({ post, slug, blogPosts }: BlogPostFooterProps) => {
  return (
    <div className="mt-8 pt-8 border-t">
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm font-medium flex items-center">
          <Tag className="w-4 h-4 mr-2" /> Tags:
        </span>
        {post.tags.map((tag, index) => (
          <span 
            key={index}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-left">Related Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(blogPosts)
          .filter(([key]) => key !== slug)
          .slice(0, 2)
          .map(([key, relatedPost]) => (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <Link 
                to={`/blog/${key}`}
                className="p-4 block hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium mb-2 hover:text-primary text-left">{relatedPost.title}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{relatedPost.date}</span>
                </div>
              </Link>
            </Card>
          ))}
      </div>
      
      <div className="mt-12">
        <Card className="p-8 bg-gray-50 text-center">
          <h3 className="text-xl font-bold mb-2">Need Auto Repair Services in Austin?</h3>
          <p className="text-gray-600 mb-4">
            Connect with ASE-certified mobile mechanics who come to your location.
          </p>
          <Link to="/">
            <Button size="lg">
              Find a Mechanic Now
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
