
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  
  // Active link styling
  const getLinkClass = (path: string) => {
    const baseClass = "transition-colors";
    const isActive = location.pathname === path;
    return isActive 
      ? `${baseClass} text-primary font-medium` 
      : `${baseClass} text-gray-700 hover:text-primary`;
  };
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link to="/" className={getLinkClass('/')}>
        Home
      </Link>
      <Link to="/mechanics" className={getLinkClass('/mechanics')}>
        Find Mechanics 
      </Link>
      <Link to="/favorites" className={getLinkClass('/favorites')}>
        My Favorites
      </Link>
      <Link to="/blog" className={getLinkClass('/blog')}>
        Blog
      </Link>
      <Link to="/how-it-works" className={getLinkClass('/how-it-works')}>
        How It Works
      </Link>
    </nav>
  );
};
