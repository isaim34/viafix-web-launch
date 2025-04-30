
import { useState, useEffect } from 'react';
import { checkSubscription } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { isSubscriptionDataStale } from '@/lib/stripe/utils';

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
      
      setIsAuthenticated(hasSession || !!hasLocalAuth);
      
      if (hasSession || hasLocalAuth) {
        setIsCheckingStatus(true);
        console.log("Checking subscription status with Stripe...");
        const result = await checkSubscription();
        
        console.log("Subscription check result:", result);
        setIsSubscribed(!!result.subscribed);
        setSubscriptionTier(result.subscription_tier || null);
        setSubscriptionEnd(result.subscription_end || null);
        
        if (result.error) {
          console.error("Error checking subscription:", result.error);
          setError(result.error);
        } else {
          setError(null);
        }
        
        setIsCheckingStatus(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setError("Error verifying authentication status");
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    // Check if we need a fresh subscription check
    const shouldRefresh = isSubscriptionDataStale();
    
    if (shouldRefresh) {
      console.log("Subscription data is stale, refreshing from server");
      checkAuth();
    } else {
      console.log("Using cached subscription data from localStorage");
      loadSubscriptionFromLocalStorage();
    }
    
    // Listen for storage events that might update subscription status
    const handleStorageEvent = () => {
      loadSubscriptionFromLocalStorage();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storage-event', handleStorageEvent);
    
    // Also listen for URL changes to detect returning from checkout
    const checkURLForCheckoutSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'subscription') {
        // If returning from a successful checkout, immediately check status
        console.log("Detected return from subscription checkout, refreshing status");
        setTimeout(() => refreshSubscriptionStatus(), 500);
        
        // Show a loading toast
        toast({
          title: "Checking subscription status",
          description: "Please wait while we verify your subscription",
        });
      }
    };
    
    checkURLForCheckoutSuccess();
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('storage-event', handleStorageEvent);
    };
  }, []);
  
  const loadSubscriptionFromLocalStorage = () => {
    const status = localStorage.getItem('subscription_status');
    const plan = localStorage.getItem('subscription_plan');
    const endDate = localStorage.getItem('subscription_end');
    
    // Make sure to convert to boolean using comparison
    setIsSubscribed(status === 'active' || status === 'trialing');
    setSubscriptionTier(plan || null);
    setSubscriptionEnd(endDate || null);
    
    // Check if we're authenticated (either Supabase or local)
    const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    setIsAuthenticated(isLoggedInLocally && !!userEmail);
  };
  
  const refreshSubscriptionStatus = async () => {
    try {
      setIsCheckingStatus(true);
      setError(null);
      
      // Force fetch fresh data by clearing the cache
      localStorage.removeItem('subscription_updated_at');
      
      console.log("Manually refreshing subscription status...");
      const result = await checkSubscription();
      
      console.log("Manual refresh result:", result);
      
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
