
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthButtons } from './AuthButtons';
import { MobileNavigation } from './MobileNavigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SearchBar } from './SearchBar';

export const Navigation: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Mechanics', href: '/mechanics' },
    { name: 'Favorites', href: '/favorites' },
  ];

  return (
    <nav className="flex-1 flex items-center justify-between">
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="text-gray-600 hover:text-primary transition-colors duration-200"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Search and Auth on desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <SearchBar />
        <AuthButtons />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden ml-auto">
        <MobileNavigation />
      </div>
    </nav>
  );
};
