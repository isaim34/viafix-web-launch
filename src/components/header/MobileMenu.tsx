
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthButtons } from './AuthButtons';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const { currentUserRole, isLoggedIn, currentUserName, getFirstName } = useAuth();
  const isMechanicRole = currentUserRole === 'mechanic';
  const isMechanicProfile = location.pathname.startsWith('/mechanics/');
  
  if (!isOpen) return null;
  
  // Active link styling
  const getLinkClass = (path: string) => {
    const baseClass = "text-gray-700 hover:text-primary transition-colors py-3 px-4 block w-full font-medium";
    const isActive = location.pathname === path;
    return isActive 
      ? `${baseClass} text-primary border-l-2 border-primary` 
      : baseClass;
  };
  
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="md:hidden">
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <nav 
        className="fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-white shadow-xl overflow-y-auto flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-medium text-lg">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Navigation Links */}
          <div className="py-2">
            <Link to="/" className={getLinkClass('/')} onClick={handleLinkClick}>
              Home
            </Link>
            
            {/* Only show Find Mechanics link if not on a mechanic profile and not a mechanic user */}
            {!isMechanicProfile && !isMechanicRole && (
              <Link to="/mechanics" className={getLinkClass('/mechanics')} onClick={handleLinkClick}>
                Find Mechanics
              </Link>
            )}
            
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
          <div className="px-4 py-4 border-t border-gray-100">
            {isLoggedIn && (
              <div className="mb-3 px-2">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-medium">{getFirstName(currentUserName) || 'User'}</p>
              </div>
            )}
            <AuthButtons isMobile={true} />
          </div>
        </div>
      </nav>
    </div>
  );
};
