
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, UserCircle, User, Settings, CreditCard } from 'lucide-react';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { syncCustomerProfileData } from '@/utils/profileSync/customerProfileSync';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCustomerPortal } from '@/lib/stripe';

export const UserMenuItems = () => {
  const navigate = useNavigate();
  const { getProfileRoute } = useAuthRedirect();
  const userRole = localStorage.getItem('userRole');

  const handleSubscriptionManagement = async () => {
    try {
      toast({
        title: "Accessing Portal",
        description: "Opening subscription management portal...",
      });

      const { url, error } = await getCustomerPortal();
      
      if (error) {
        throw new Error(error);
      }
      
      if (url) {
        window.open(url, '_blank') || window.location.assign(url);
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Failed to open subscription portal:", error);
      toast({
        title: "Unable to Access Portal",
        description: "We couldn't connect to the subscription management portal. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        syncCustomerProfileData(userEmail);
      }
      
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      
      window.dispatchEvent(new Event('storage-event'));
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/', { replace: true });
      
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

  return (
    <>
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

      <DropdownMenuItem asChild>
        <Link to="/settings" className="flex items-center cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={handleSubscriptionManagement} className="cursor-pointer">
        <CreditCard className="mr-2 h-4 w-4" />
        <span>Manage Subscription</span>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </>
  );
};
