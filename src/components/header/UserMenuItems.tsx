
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, UserCircle, User, Settings, CreditCard, ExternalLink, Info, AlertCircle, CalendarClock } from 'lucide-react';
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

export const UserMenuItems = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigAlert, setShowConfigAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { getProfileRoute } = useAuthRedirect();
  const userRole = localStorage.getItem('userRole');
  const { toast } = useToast();
  
  // Get subscription status from localStorage
  const subscriptionStatus = localStorage.getItem('subscription_status');
  const subscriptionPlan = localStorage.getItem('subscription_plan');
  const isSubscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';

  const handleSubscriptionManagement = async () => {
    try {
      setIsLoading(true);
      setShowConfigAlert(false);
      setErrorMessage(null);
      
      toast({
        title: "Accessing Portal",
        description: "Opening subscription management portal...",
      });

      const { url, error, needsConfiguration, rawError, isAccountPage, message } = await getCustomerPortal();
      
      if (error) {
        console.error("Portal access error:", error);
        console.error("Raw error details:", rawError);
        
        // Show different message based on the error type
        if (needsConfiguration) {
          setShowConfigAlert(true);
          toast({
            title: "Portal Configuration Required",
            description: "The Stripe Customer Portal needs to be configured",
            variant: "default"
          });
        } else {
          setErrorMessage(error);
          toast({
            title: "Unable to Access Portal",
            description: error,
            variant: "destructive"
          });
        }
        return;
      }
      
      if (url) {
        if (isAccountPage) {
          toast({
            title: "Opening Stripe Account",
            description: message || "Customer Portal isn't set up yet. Opening Stripe account page instead.",
          });
        }
        window.open(url, '_blank') || window.location.assign(url);
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Failed to open subscription portal:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
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
      localStorage.removeItem('subscription_status');
      localStorage.removeItem('subscription_plan');
      localStorage.removeItem('subscription_end');
      
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
      
      {isSubscribed && (
        <div className="px-2 py-1.5 mb-1">
          <div className="p-2 bg-green-50 border border-green-200 rounded-md text-xs flex items-start gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-green-800">
              <span className="font-medium">
                {subscriptionPlan?.charAt(0).toUpperCase() + subscriptionPlan?.slice(1)} Plan Active
              </span>
              <p className="text-xs mt-0.5">
                Access to all premium features
              </p>
            </div>
          </div>
        </div>
      )}
      
      {showConfigAlert && (
        <div className="px-2 py-1.5 mb-1">
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-md text-xs">
            <div className="flex items-start">
              <Info className="h-3 w-3 text-amber-500 mt-0.5 mr-1.5 flex-shrink-0" />
              <div>
                <span className="text-amber-800">
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
              </div>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && !showConfigAlert && (
        <div className="px-2 py-1.5 mb-1">
          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-xs">
            <div className="flex items-start">
              <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 mr-1.5 flex-shrink-0" />
              <div className="text-red-800">{errorMessage}</div>
            </div>
          </div>
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
