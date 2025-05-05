import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserGreeting } from './UserGreeting';
import { UserAvatar } from './UserAvatar';
import { UserMenuItems } from './UserMenuItems';
import { useAuth } from '@/hooks/useAuth';

interface AuthButtonsProps {
  isMobile?: boolean;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, authChecked, currentUserRole } = useAuth();
  const [checkedAuth, setCheckedAuth] = useState(false);
  
  // Ensure we don't show logged-in components until we've checked auth state
  useEffect(() => {
    if (authChecked) {
      console.log("Auth status confirmed in AuthButtons:", { isLoggedIn, currentUserRole });
      setCheckedAuth(true);
    }
  }, [authChecked, isLoggedIn, currentUserRole]);
  
  // If we haven't checked auth yet, don't render anything to prevent flashing
  if (!authChecked) {
    return null;
  }

  // Authentication is checked and user is logged in
  if (isLoggedIn) {
    return (
      <div className={isMobile ? "space-y-3" : "flex items-center space-x-4"}>
        <div className="text-sm">
          <UserGreeting isMobile={isMobile} />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserAvatar />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <UserMenuItems />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Authentication is checked and user is not logged in
  return (
    <div className={isMobile ? "space-y-3" : "space-x-4"}>
      <Button 
        variant="ghost" 
        className={isMobile ? "w-full justify-start" : ""} 
        onClick={() => navigate('/signin')}
      >
        Sign in
      </Button>
      <Button 
        className={isMobile ? "w-full justify-start" : ""} 
        onClick={() => navigate('/signup')}
      >
        Sign up
      </Button>
    </div>
  );
};
