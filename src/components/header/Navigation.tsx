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
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          ViaFix
        </Link>

        {/* Mobile Navigation */}
        {isSmallScreen ? (
          <MobileNavigation />
        ) : (
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <SearchBar />

            {/* Authentication Buttons */}
            <AuthButtons />
          </div>
        )}
      </div>
    </header>
  );
};
