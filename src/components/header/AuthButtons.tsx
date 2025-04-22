
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthButtonsProps {
  isMobile?: boolean;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUserName, currentUserRole, getFirstName } = useAuth();
  const { getProfileRoute } = useAuthRedirect();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const handleStorageEvent = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('storage-event', handleStorageEvent);
    return () => window.removeEventListener('storage-event', handleStorageEvent);
  }, []);

  const getProfileImage = (): string => {
    try {
      if (currentUserRole === 'customer') {
        const userId = localStorage.getItem('userId');
        return localStorage.getItem(`customer-${userId}-profileImage`) || '';
      } else if (currentUserRole === 'mechanic') {
        return localStorage.getItem('mechanicAvatar') || '';
      }
      return '';
    } catch (error) {
      console.error('Error accessing profile image:', error);
      return '';
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      
      window.dispatchEvent(new Event('storage-event'));
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Extract user info directly from localStorage for consistent real-time data
  const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole') as 'customer' | 'mechanic' | null;
  const userName = localStorage.getItem('userName') || '';
  
  // Get just the first name for display
  const extractFirstName = (name: string): string => {
    if (!name) return '';
    // Handle email addresses - if contains @ symbol, extract username portion
    if (name.includes('@')) {
      const username = name.split('@')[0];
      // Convert first letter to uppercase for better display
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    // Regular name - just return first part
    return name.split(' ')[0] || '';
  };
  
  const firstName = extractFirstName(userName);
  const profileImage = getProfileImage();

  if (userLoggedIn) {
    return (
      <div className={isMobile ? "space-y-3" : "flex items-center space-x-4"}>
        <div className="text-sm">
          {isMobile ? (
            <div className="pb-2">
              <p className="font-medium">Hello, {firstName}</p>
              <p className="text-muted-foreground capitalize">{userRole || currentUserRole}</p>
            </div>
          ) : (
            <p className="hidden md:block text-right mr-2">
              Hello, <span className="font-medium">{firstName}</span>
            </p>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileImage} alt={firstName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link to={getProfileRoute(userRole)} className="flex items-center cursor-pointer">
                {userRole === 'customer' ? (
                  <>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Your Profile</span>
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </>
                )}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (location.pathname.includes('/mechanic-dashboard') && !userLoggedIn) {
    return null;
  }

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
