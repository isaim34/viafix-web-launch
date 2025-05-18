
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthButtons } from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  
  if (!isOpen) return null;
  
  // Active link styling
  const getLinkClass = (path: string) => {
    const baseClass = "text-gray-700 hover:text-primary transition-colors py-2 block";
    const isActive = location.pathname === path;
    return isActive 
      ? `${baseClass} text-primary font-medium` 
      : baseClass;
  };
  
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={onClose} />
      <nav className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl overflow-y-auto">
        <div className="flex flex-col p-4">
          {/* Navigation Links */}
          <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
            <Link to="/" className={getLinkClass('/')} onClick={handleLinkClick}>
              Home
            </Link>
            <Link to="/mechanics" className={getLinkClass('/mechanics')} onClick={handleLinkClick}>
              Find Mechanics
            </Link>
            <Link to="/favorites" className={getLinkClass('/favorites')} onClick={handleLinkClick}>
              My Favorites
            </Link>
            <Link to="/blog" className={getLinkClass('/blog')} onClick={handleLinkClick}>
              Blog
            </Link>
            <Link to="/how-it-works" className={getLinkClass('/how-it-works')} onClick={handleLinkClick}>
              How It Works
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="mt-2">
            <AuthButtons isMobile={true} />
          </div>
        </div>
      </nav>
    </div>
  );
};
