
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
      <nav className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl">
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors py-2">
            Home
          </Link>
          <Link to="/mechanics" className="text-gray-700 hover:text-primary transition-colors py-2">
            Find Mechanics
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors py-2">
            Blog
          </Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-primary transition-colors py-2">
            How It Works
          </Link>
        </div>
      </nav>
    </div>
  );
};
