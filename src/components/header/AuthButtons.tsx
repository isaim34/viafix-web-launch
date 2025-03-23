
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
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

interface AuthButtonsProps {
  isMobile?: boolean;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const { isLoggedIn, currentUserName, currentUserRole, currentUserId } = useCustomerAuth();
  
  // Force component to update when authentication state changes
  useEffect(() => {
    const handleStorageEvent = () => {
      // This will trigger a re-render when the storage-event is dispatched
      // after login/logout operations
    };
    
    window.addEventListener('storage-event', handleStorageEvent);
    return () => window.removeEventListener('storage-event', handleStorageEvent);
  }, []);
  
  // Get customer profile image if available
  const profileImage = currentUserRole === 'customer' 
    ? localStorage.getItem(`customer-${currentUserId}-profileImage`) || ''
    : '';

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    // Dispatch storage event to notify all components
    window.dispatchEvent(new Event('storage-event'));
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    navigate('/');
  };

  if (isLoggedIn) {
    return (
      <div className={isMobile ? "space-y-3" : "flex items-center space-x-4"}>
        <div className="text-sm">
          {isMobile ? (
            <div className="pb-2">
              <p className="font-medium">Hello, {currentUserName}</p>
              <p className="text-muted-foreground capitalize">{currentUserRole}</p>
            </div>
          ) : (
            <p className="hidden md:block text-right mr-2">
              Hello, <span className="font-medium">{currentUserName}</span>
            </p>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileImage} alt={currentUserName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUserName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {currentUserRole === 'customer' && (
              <DropdownMenuItem asChild>
                <Link to="/customer/profile" className="flex items-center cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Your Profile</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {currentUserRole === 'mechanic' && (
              <DropdownMenuItem asChild>
                <Link to="/mechanic/dashboard" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
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
