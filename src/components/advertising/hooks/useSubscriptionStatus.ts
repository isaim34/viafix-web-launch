
import { useState, useEffect } from 'react';
import { checkSubscription } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  isCheckingStatus: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  error: string | null;
  refreshSubscriptionStatus: () => Promise<void>;
}

export const useSubscriptionStatus = (): SubscriptionStatus => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      
      // Also check local auth as fallback
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      const userEmail = localStorage.getItem('userEmail');
      const hasLocalAuth = isLoggedInLocally && userEmail;
      
      setIsAuthenticated(hasSession || !!hasLocalAuth); // Convert to boolean with !! operator
      
      if (hasSession || hasLocalAuth) {
        setIsCheckingStatus(true);
        const result = await checkSubscription();
        setIsSubscribed(!!result.subscribed); // Convert to boolean with !! operator
        setSubscriptionTier(result.subscription_tier || null);
        setSubscriptionEnd(result.subscription_end || null);
        if (result.error) {
          setError(result.error);
        }
        setIsCheckingStatus(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Listen for storage events that might update subscription status
    const handleStorageEvent = () => {
      const status = localStorage.getItem('subscription_status');
      const plan = localStorage.getItem('subscription_plan');
      const endDate = localStorage.getItem('subscription_end');
      
      // Make sure to convert to boolean using comparison
      setIsSubscribed(status === 'active' || status === 'trialing');
      setSubscriptionTier(plan || null);
      setSubscriptionEnd(endDate || null);
    };
    
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storage-event', handleStorageEvent);
    
    // Also listen for URL changes to detect returning from checkout
    const checkURLForCheckoutSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'subscription') {
        // If returning from a successful checkout, immediately check status
        setTimeout(() => refreshSubscriptionStatus(), 1000);
      }
    };
    
    checkURLForCheckoutSuccess();
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('storage-event', handleStorageEvent);
    };
  }, []);
  
  const refreshSubscriptionStatus = async () => {
    try {
      setIsCheckingStatus(true);
      setError(null);
      
      // Force fetch fresh data
      localStorage.removeItem('subscription_status');
      localStorage.removeItem('subscription_plan');
      localStorage.removeItem('subscription_end');
      
      const result = await checkSubscription();
      
      if (result.error) {
        toast({
          title: "Error checking subscription",
          description: result.error,
          variant: "destructive"
        });
        setError(result.error);
      } else {
        // Convert to boolean using !! operator to ensure boolean type
        setIsSubscribed(!!result.subscribed);
        setSubscriptionTier(result.subscription_tier);
        setSubscriptionEnd(result.subscription_end);
        
        toast({
          title: "Subscription status refreshed",
          description: result.subscribed 
            ? `You are subscribed to the ${result.subscription_tier} plan`
            : "You don't have an active subscription"
        });
      }
    } catch (error) {
      console.error("Error refreshing subscription status:", error);
      toast({
        title: "Refresh failed",
        description: "Unable to refresh subscription status",
        variant: "destructive"
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };
  
  return {
    isAuthenticated,
    isSubscribed,
    isCheckingStatus,
    subscriptionTier,
    subscriptionEnd,
    error,
    refreshSubscriptionStatus
  };
};
