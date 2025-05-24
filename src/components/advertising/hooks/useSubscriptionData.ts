
import { useState, useEffect } from 'react';
import { checkSubscription } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionData = () => {
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const isSubscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';

  // Load subscription data from localStorage
  const loadSubscriptionData = () => {
    setCurrentPlan(localStorage.getItem('subscription_plan'));
    setSubscriptionStatus(localStorage.getItem('subscription_status'));
    setSubscriptionEnd(localStorage.getItem('subscription_end'));
  };

  // Check authentication and load subscription data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        setIsLoadingSubscription(true);
        
        // Check authentication
        const { data } = await supabase.auth.getSession();
        const isAuthenticated = !!data.session;
        
        // Also check local authentication as fallback
        const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');
        const hasLocalAuth = isLoggedInLocally && userRole && userEmail;
        
        if (!isAuthenticated && !hasLocalAuth) {
          setError("You need to be signed in to view subscription status");
          setIsLoadingSubscription(false);
          return;
        }
        
        // Load subscription data and check with Stripe
        loadSubscriptionData();
        
        const result = await checkSubscription();
        if (result.error) {
          console.error("Error checking subscription:", result.error);
          if (result.authError) {
            setError("Authentication error when checking subscription status. Please try signing out and back in.");
          } else {
            setError(`Error checking subscription status: ${result.error}`);
          }
        }
        
        // Refresh data from localStorage after Stripe check
        loadSubscriptionData();
        
      } catch (error) {
        console.error("Error in auth/subscription check:", error);
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    checkAuthAndLoadData();
    
    // Listen for storage changes
    window.addEventListener('storage', loadSubscriptionData);
    window.addEventListener('storage-event', loadSubscriptionData);
    
    return () => {
      window.removeEventListener('storage', loadSubscriptionData);
      window.removeEventListener('storage-event', loadSubscriptionData);
    };
  }, []);

  return {
    isLoadingSubscription,
    currentPlan,
    subscriptionStatus,
    subscriptionEnd,
    isSubscribed,
    error,
    setError,
    loadSubscriptionData
  };
};
