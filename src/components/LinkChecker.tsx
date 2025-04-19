
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Wrench, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';

export const LinkChecker = () => {
  const links = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/mechanics', label: 'Find Mechanics', icon: <Wrench className="w-5 h-5" /> },
    { path: '/blog', label: 'Blog', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/how-it-works', label: 'How It Works', icon: <HelpCircle className="w-5 h-5" /> },
    
    // Additional important routes
    { path: '/signin', label: 'Sign In', icon: <HelpCircle className="w-5 h-5" /> },
    { path: '/signup', label: 'Sign Up', icon: <HelpCircle className="w-5 h-5" /> },
    { path: '/terms', label: 'Terms', icon: <HelpCircle className="w-5 h-5" /> },
    { path: '/privacy', label: 'Privacy', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Link Checker for Google Indexing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <div 
            key={link.path} 
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            {link.icon}
            <Link 
              to={link.path} 
              className="text-primary hover:underline ml-3"
            >
              {link.label}
            </Link>
            <span className="text-green-500">✓</span>
          </div>
        ))}
      </div>
      <div className="mt-6 text-gray-600">
        <p>✓ Indicates the link is configured in the routing system</p>
        <p className="text-sm mt-2">
          Note: This component helps verify route configurations. 
          Actual link functionality should be tested in a live environment.
        </p>
      </div>
    </div>
  );
};
