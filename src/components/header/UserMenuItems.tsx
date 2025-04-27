
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, UserCircle, User, Settings, CreditCard, ExternalLink, Info } from 'lucide-react';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { syncCustomerProfileData } from '@/utils/profileSync/customerProfileSync';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCustomerPortal } from '@/lib/stripe';
import { Alert } from '@/components/ui/alert';

export const UserMenuItems = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigAlert, setShowConfigAlert] = useState(false);
  const navigate = useNavigate();
  const { getProfileRoute } = useAuthRedirect();
  const userRole = localStorage.getItem('userRole');
  const { toast } = useToast();

  const handleSubscriptionManagement = async () => {
    try {
      setIsLoading(true);
      setShowConfigAlert(false);
      
      toast({
        title: "Accessing Portal",
        description: "Opening subscription management portal...",
      });

      const { url, error, needsConfiguration } = await getCustomerPortal();
      
      if (error) {
        console.error("Portal access error:", error);
        
        // Show different message based on the error type
        if (needsConfiguration) {
          setShowConfigAlert(true);
          toast({
            title: "Portal Configuration Required",
            description: "The Stripe Customer Portal needs to be configured",
            variant: "default"
          });
        } else {
          toast({
            title: "Unable to Access Portal",
            description: error,
            variant: "destructive"
          });
        }
        return;
      }
      
      if (url) {
        window.open(url, '_blank') || window.location.assign(url);
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Failed to open subscription portal:", error);
      toast({
        title: "Portal Access Error",
        description: error instanceof Error ? error.message : "Failed to open the portal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      
      {showConfigAlert && (
        <div className="px-2 py-1.5 mb-1">
          <Alert variant="default" className="p-2 bg-amber-50 border-amber-200 text-xs">
            <Info className="h-3 w-3 text-amber-500" />
            <span className="ml-2">
              Portal needs configuration.{' '}
              <a 
                href="https://dashboard.stripe.com/test/settings/billing/portal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                Configure
                <ExternalLink className="ml-1 h-2 w-2" />
              </a>
            </span>
          </Alert>
        </div>
      )}
      
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

      <DropdownMenuItem 
        onClick={handleSubscriptionManagement} 
        className="cursor-pointer"
        disabled={isLoading}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        <span>{isLoading ? "Loading..." : "Manage Subscription"}</span>
        {!isLoading && <ExternalLink className="ml-1 h-3 w-3" />}
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </>
  );
};
