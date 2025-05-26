
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
    console.log("📱 Loading subscription data from localStorage...");
    const plan = localStorage.getItem('subscription_plan');
    const status = localStorage.getItem('subscription_status');
    const end = localStorage.getItem('subscription_end');
    
    console.log("📊 localStorage subscription data:", { plan, status, end });
    
    setCurrentPlan(plan);
    setSubscriptionStatus(status);
    setSubscriptionEnd(end);
  };

  // Check authentication and load subscription data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        console.log("🔍 Starting auth and subscription check...");
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
        
        console.log("🔐 Authentication status:", { 
          isAuthenticated, 
          hasLocalAuth, 
          userEmail,
          userRole 
        });
        
        if (!isAuthenticated && !hasLocalAuth) {
          console.log("❌ No authentication found");
          setError("You need to be signed in to view subscription status");
          setIsLoadingSubscription(false);
          return;
        }
        
        // Load subscription data first from localStorage
        loadSubscriptionData();
        
        // Then try to check with the service - with better error handling
        try {
          console.log("🚀 Calling checkSubscription with auth status:", { 
            isAuthenticated, 
            hasLocalAuth, 
            userEmail 
          });
          
          const result = await checkSubscription();
          console.log("📦 checkSubscription result:", result);
          
          if (result.error && !result.authError) {
            console.error("❌ Subscription service error:", result.error);
            setError(result.error);
          } else if (result.authError) {
            console.error("❌ Authentication error in subscription check:", result.error);
            setError("Authentication required. Please sign in again.");
          } else {
            console.log("✅ Subscription check successful");
            // Success - refresh data from localStorage after successful check
            setTimeout(() => loadSubscriptionData(), 100);
            setError(null);
          }
        } catch (serviceError) {
          console.error("❌ Subscription service error:", serviceError);
          setError("Unable to verify subscription status. Please try again later.");
        }
        
      } catch (error) {
        console.error("❌ Error in auth/subscription check:", error);
        setError("Unable to load subscription status");
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    checkAuthAndLoadData();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      console.log("📱 Storage change detected, reloading subscription data...");
      loadSubscriptionData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage-event', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage-event', handleStorageChange);
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
