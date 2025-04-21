
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  
  if (!isOpen) return null;
  
  // Active link styling
  const getLinkClass = (path: string) => {
    const baseClass = "text-gray-700 hover:text-primary transition-colors py-2";
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
      <nav className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl">
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/" className={getLinkClass('/')} onClick={handleLinkClick}>
            Home
          </Link>
          <Link to="/mechanics" className={getLinkClass('/mechanics')} onClick={handleLinkClick}>
            Find Mechanics
          </Link>
          <Link to="/blog" className={getLinkClass('/blog')} onClick={handleLinkClick}>
            Blog
          </Link>
          <Link to="/how-it-works" className={getLinkClass('/how-it-works')} onClick={handleLinkClick}>
            How It Works
          </Link>
        </div>
      </nav>
    </div>
  );
};
