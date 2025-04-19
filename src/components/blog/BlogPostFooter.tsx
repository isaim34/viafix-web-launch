
import React from 'react';
import { Tag, Calendar, Star, Users, ArrowRight, Shield, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Card } from '@/components/ui/card';
import { BlogPost, BlogPostsCollection } from '@/types/blog';

interface BlogPostFooterProps {
  post: BlogPost;
  slug: string;
  blogPosts: BlogPostsCollection;
}

export const BlogPostFooter = ({ post, slug, blogPosts }: BlogPostFooterProps) => {
  // Determine the CTA variant based on post category
  const getCategorySpecificCTA = (category: string) => {
    switch (category.toLowerCase()) {
      case 'maintenance':
        return {
          title: "Don't Put Off Essential Maintenance",
          description: "Connect with certified mechanics who can perform the maintenance services discussed in this article.",
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          action: "Schedule Maintenance Now"
        };
      case 'diagnostics':
        return {
          title: "Experiencing Vehicle Problems?",
          description: "Our ASE-certified mechanics can diagnose and fix your vehicle issues on the spot.",
          icon: <Shield className="w-5 h-5 text-blue-500" />,
          action: "Get a Diagnosis Today"
        };
      case 'parts':
        return {
          title: "Need Quality Parts & Installation?",
          description: "ViaFix mechanics use reliable parts and provide professional installation at your location.",
          icon: <Tag className="w-5 h-5 text-green-500" />,
          action: "Find Parts & Service"
        };
      case 'service':
        return {
          title: "Experience Convenient Mobile Service",
          description: "Skip the shop visit. Our mobile mechanics come to your home or workplace.",
          icon: <MapPin className="w-5 h-5 text-red-500" />,
          action: "Book Mobile Service"
        };
      default:
        return {
          title: "Need Auto Repair Services in Austin?",
          description: "Connect with ASE-certified mobile mechanics who come to your location.",
          icon: <Users className="w-5 h-5 text-primary" />,
          action: "Find a Mechanic Now"
        };
    }
  };

  const ctaInfo = getCategorySpecificCTA(post.category);

  return (
    <div className="mt-8 pt-8 border-t">
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm font-medium flex items-center">
          <Tag className="w-4 h-4 mr-2" /> Tags:
        </span>
        {post.tags && post.tags.map((tag, index) => (
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
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="bg-gradient-to-r from-primary/90 to-primary p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-white/10 rounded-full">
                {ctaInfo.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{ctaInfo.title}</h3>
                <p className="text-white/90 mb-4">
                  {ctaInfo.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex items-center bg-white/20 px-3 py-1.5 rounded-full text-sm">
                    <Star className="w-3.5 h-3.5 text-yellow-300 mr-1.5" fill="currentColor" />
                    <span className="font-medium">4.8/5</span>
                    <span className="ml-1 text-white/70">(200+ reviews)</span>
                  </div>
                  
                  <div className="flex items-center bg-white/20 px-3 py-1.5 rounded-full text-sm">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    <span>Most services same-day</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <Link to="/">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto bg-white text-primary hover:bg-white/90 font-bold shadow-md group"
                  >
                    {ctaInfo.action}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
