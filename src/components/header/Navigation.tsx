
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { NotificationBadge } from '@/components/notifications/NotificationBadge';

export const Navigation = () => {
  const location = useLocation();
  const { currentUserRole, isLoggedIn } = useAuth();
  const isMechanicRole = currentUserRole === 'mechanic';
  const isMechanicProfile = location.pathname.startsWith('/mechanics/');
  const isMobile = useIsMobile();
  
  // Active link styling
  const getLinkClass = (path: string) => {
    const baseClass = "transition-colors text-sm";
    const isActive = location.pathname === path;
    return isActive 
      ? `${baseClass} text-primary font-medium` 
      : `${baseClass} text-gray-700 hover:text-primary`;
  };
  
  // Don't render on mobile - it will use the MobileMenu instead
  if (isMobile) {
    return null;
  }
  
  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
      <Link to="/" className={getLinkClass('/')}>
        Home
      </Link>
      
      {/* Only show Find Mechanics link if not on a mechanic profile and not a mechanic user */}
      {!isMechanicProfile && !isMechanicRole && (
        <Link to="/mechanics" className={getLinkClass('/mechanics')}>
          Find Mechanics 
        </Link>
      )}
      
      <Link to="/favorites" className={getLinkClass('/favorites')}>
        My Favorites
      </Link>
      
      {/* Messages link - show for all logged in users */}
      {isLoggedIn && (
        <Link to="/messages" className={`${getLinkClass('/messages')} flex items-center gap-2`}>
          <span>Messages</span>
          <NotificationBadge showIcon={false} />
        </Link>
      )}
      
      <Link to="/blog" className={getLinkClass('/blog')}>
        Blog
      </Link>
      
      <Link to="/how-it-works" className={getLinkClass('/how-it-works')}>
        How It Works
      </Link>
    </nav>
  );
};
