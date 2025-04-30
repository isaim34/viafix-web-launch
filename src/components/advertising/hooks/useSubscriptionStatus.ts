
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        setIsAuthenticated(hasSession);
        
        if (hasSession) {
          setIsCheckingStatus(true);
          const result = await checkSubscription();
          setIsSubscribed(result.subscribed || false);
          setSubscriptionTier(result.subscription_tier || localStorage.getItem('subscription_plan'));
          setSubscriptionEnd(result.subscription_end || localStorage.getItem('subscription_end'));
          setIsCheckingStatus(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsCheckingStatus(false);
      }
    };
    
    checkAuth();
    
    // Listen for storage events that might update subscription status
    const handleStorageEvent = () => {
      const status = localStorage.getItem('subscription_status');
      const plan = localStorage.getItem('subscription_plan');
      const endDate = localStorage.getItem('subscription_end');
      
      setIsSubscribed(status === 'active' || status === 'trialing');
      setSubscriptionTier(plan || null);
      setSubscriptionEnd(endDate || null);
    };
    
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storage-event', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('storage-event', handleStorageEvent);
    };
  }, []);
  
  const refreshSubscriptionStatus = async () => {
    try {
      setIsCheckingStatus(true);
      setError(null);
      
      const result = await checkSubscription();
      
      if (result.error) {
        toast({
          title: "Error checking subscription",
          description: result.error,
          variant: "destructive"
        });
      } else {
        setIsSubscribed(result.subscribed || false);
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
