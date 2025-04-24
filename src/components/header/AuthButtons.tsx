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
import { syncCustomerProfileData } from '@/utils/profileSync/customerProfileSync';

interface AuthButtonsProps {
  isMobile?: boolean;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUserRole, getFirstName } = useAuth();
  const { getProfileRoute } = useAuthRedirect();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const handleStorageEvent = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('storage-event', handleStorageEvent);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('storage-event', handleStorageEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const getProfileImage = (): string => {
    try {
      if (currentUserRole === 'customer') {
        const userId = localStorage.getItem('userId');
        return localStorage.getItem(`customer-${userId}-profileImage`) || '';
      } else if (currentUserRole === 'mechanic') {
        // For mechanics, check multiple possible locations for the avatar
        return (
          localStorage.getItem('mechanicAvatar') || 
          localStorage.getItem('mechanic-avatar') || 
          localStorage.getItem('vendorAvatar') || 
          ''
        );
      }
      return '';
    } catch (error) {
      console.error('Error accessing profile image:', error);
      return '';
    }
  };

  const handleLogout = () => {
    try {
      // Sync profile data before logging out to ensure it persists
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        syncCustomerProfileData(userEmail);
      }
      
      // Clear auth related localStorage entries
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      // Don't remove userId and userEmail immediately to allow profile sync
      
      window.dispatchEvent(new Event('storage-event'));
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/', { replace: true });
      
      // Clear remaining user data after a short delay to ensure sync completes
      setTimeout(() => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
      }, 500);
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user information directly from localStorage for real-time access
  const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  
  // Get proper name with priority checks - look in multiple places for the name
  let displayName = '';
  
  // First check for mechanic-specific name (vendorName)
  if (userRole === 'mechanic') {
    const vendorName = localStorage.getItem('vendorName');
    if (vendorName) {
      // Just get the first name for display
      displayName = vendorName.split(' ')[0];
    }
  }
  
  // If no vendor name found, check the regular userName
  if (!displayName) {
    const fullName = localStorage.getItem('userName') || '';
    
    // If fullName is an email and we have a registered name, use that instead
    if (fullName.includes('@') && userEmail) {
      // Try to get a registered name for this email
      const registeredName = localStorage.getItem(`registered_${userEmail}`);
      if (registeredName) {
        // Just get the first name from the registered name
        displayName = registeredName.split(' ')[0];
      } else {
        // Fall back to extracting from email
        displayName = getFirstName(fullName);
      }
    } else if (fullName) {
      // Regular name - just take first part
      displayName = getFirstName(fullName);
    }
  }
  
  // Check profile data as a last resort
  if (!displayName && userRole) {
    try {
      const profileKey = userRole === 'mechanic' ? 'mechanicProfile' : 'customerProfile';
      const profileData = localStorage.getItem(profileKey);
      if (profileData) {
        const profile = JSON.parse(profileData);
        if (profile.firstName) {
          displayName = profile.firstName;
        }
      }
    } catch (e) {
      console.error('Error getting name from profile:', e);
    }
  }
  
  // If we still don't have a name, use a role-based default
  if (!displayName && userRole) {
    displayName = userRole === 'mechanic' ? 'Mechanic' : 'Customer';
  }
  
  const profileImage = getProfileImage();

  if (userLoggedIn) {
    return (
      <div className={isMobile ? "space-y-3" : "flex items-center space-x-4"}>
        <div className="text-sm">
          {isMobile ? (
            <div className="pb-2">
              <p className="font-medium">Hello, {displayName}</p>
              <p className="text-muted-foreground capitalize">{userRole}</p>
            </div>
          ) : (
            <p className="hidden md:block text-right mr-2">
              Hello, <span className="font-medium">{displayName}</span>
            </p>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileImage} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link to={getProfileRoute(userRole as 'customer' | 'mechanic' | null)} className="flex items-center cursor-pointer">
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
