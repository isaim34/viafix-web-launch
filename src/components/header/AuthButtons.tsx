
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface AuthButtonsProps {
  isMobile?: boolean;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const { isLoggedIn, isMechanicLoggedIn, currentUserName, currentUserRole } = useAuth();
  
  const baseClassName = isMobile ? "justify-start" : "";
  
  const getDashboardLink = () => {
    if (isMechanicLoggedIn) {
      return '/mechanic/dashboard';
    }
    return null;
  };
  
  const handleSignOut = () => {
    // Clear auth data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    // Show success toast
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    
    // Redirect to home page
    navigate('/');
  };

  if (isLoggedIn) {
    return (
      <>
        <div className={`text-sm font-medium ${isMobile ? "py-2" : ""}`}>
          Hello, {currentUserName}
          {currentUserRole && <span className="ml-1 text-xs text-gray-500">({currentUserRole})</span>}
        </div>
        
        {/* Dashboard link for mechanics */}
        {getDashboardLink() && (
          <Button 
            variant="ghost" 
            size="sm" 
            className={baseClassName}
            onClick={() => navigate(getDashboardLink() || '/')}
          >
            Dashboard
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={baseClassName}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Button 
          variant="ghost" 
          size="sm" 
          className={baseClassName}
          onClick={() => navigate('/signin')}
        >
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>
        <Button 
          size="sm" 
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </>
    );
  }
};
