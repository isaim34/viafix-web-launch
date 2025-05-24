
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
        setError(null);
        
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
        
        // Load subscription data first from localStorage
        loadSubscriptionData();
        
        // Then try to check with the service - with better error handling
        try {
          console.log("Calling checkSubscription with auth status:", { 
            isAuthenticated, 
            hasLocalAuth, 
            userEmail 
          });
          
          const result = await checkSubscription();
          console.log("checkSubscription result:", result);
          
          if (result.error && !result.authError) {
            console.error("Subscription service error:", result.error);
            // Don't set this as a blocking error, just log it
            console.log("Using cached subscription data due to service error");
          } else if (result.authError) {
            console.error("Authentication error in subscription check:", result.error);
            setError("Authentication required. Please sign in again.");
          } else {
            // Success - refresh data from localStorage after successful check
            setTimeout(() => loadSubscriptionData(), 100);
            setError(null);
          }
        } catch (serviceError) {
          console.error("Subscription service error:", serviceError);
          // Don't fail completely, just use cached data
        }
        
      } catch (error) {
        console.error("Error in auth/subscription check:", error);
        setError("Unable to load subscription status");
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
