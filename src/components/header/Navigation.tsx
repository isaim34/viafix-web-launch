
import React from 'react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/mechanics" className="text-gray-700 hover:text-primary transition-colors">
        Find Mechanics 
      </Link>
      <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors">
        Blog
      </Link>
      <Link to="/how-it-works" className="text-gray-700 hover:text-primary transition-colors">
        How It Works
      </Link>
    </nav>
  );
};
