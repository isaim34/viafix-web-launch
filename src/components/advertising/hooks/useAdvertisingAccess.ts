
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { checkSubscription } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

export const useAdvertisingAccess = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  const { isLoggedIn, authChecked, currentUserRole } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      console.log("🔍 Checking advertising access...");
      setIsLoading(true);
      setError(null);
      
      // Wait for auth to be checked
      if (!authChecked) {
        console.log("⏳ Waiting for auth to be checked...");
        return;
      }
      
      // Check if user is logged in
      if (!isLoggedIn) {
        console.log("❌ User not logged in");
        setError("You must be logged in to access advertising options");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Check role from context or localStorage
      let effectiveRole = currentUserRole || localStorage.getItem('userRole');
      console.log("👤 Checking user role:", { currentUserRole, effectiveRole });
      
      // Try to get user role from Supabase if needed
      if (!effectiveRole && isLoggedIn) {
        try {
          console.log("🔍 Fetching user role from Supabase...");
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (!userError && user) {
            effectiveRole = user.user_metadata?.role || user.user_metadata?.user_type;
            
            if (effectiveRole) {
              localStorage.setItem('userRole', effectiveRole);
              window.dispatchEvent(new Event('storage-event'));
              console.log("✅ Role found and stored:", effectiveRole);
            }
          }
        } catch (error) {
          console.error("❌ Error fetching user from Supabase:", error);
        }
      }
      
      // Check if user is a mechanic
      if (effectiveRole !== 'mechanic') {
        console.log("❌ User is not a mechanic:", effectiveRole);
        setError("Advertising options are only available for mechanics");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      console.log("✅ User is a mechanic, checking subscription...");
      
      // For mechanics, check subscription status with better error handling
      try {
        const subscriptionResult = await checkSubscription();
        console.log("📦 Subscription check result:", subscriptionResult);
        
        if (subscriptionResult.error) {
          if (subscriptionResult.authError) {
            console.log("🔄 Auth error - attempting to refresh session...");
            try {
              await supabase.auth.refreshSession();
              console.log("✅ Session refreshed, retrying subscription check...");
              
              // Retry subscription check after refresh
              const retryResult = await checkSubscription();
              console.log("🔄 Retry subscription result:", retryResult);
              
              if (retryResult.error) {
                setError("Authentication required. Please sign in again.");
                setHasAccess(false);
              } else if (retryResult.subscribed) {
                console.log("✅ User has active subscription after retry");
                setHasAccess(true);
                setError(null);
              } else {
                console.log("⚠️ User does not have active subscription after retry");
                setError("An active subscription is required to access advertising features");
                setHasAccess(false);
              }
            } catch (refreshError) {
              console.error("❌ Session refresh failed:", refreshError);
              setError("Session expired. Please sign in again.");
              setHasAccess(false);
            }
          } else {
            console.error("❌ Subscription check error:", subscriptionResult.error);
            setError("Unable to verify subscription status. Please try again later.");
            setHasAccess(false);
          }
        } else if (subscriptionResult.subscribed) {
          console.log("✅ User has active subscription, granting access");
          setHasAccess(true);
          setError(null);
        } else {
          console.log("⚠️ User does not have active subscription");
          setError("An active subscription is required to access advertising features");
          setHasAccess(false);
        }
      } catch (subscriptionError) {
        console.error("❌ Error checking subscription:", subscriptionError);
        setError("Unable to verify subscription status. Please try again later.");
        setHasAccess(false);
      }
      
      setIsLoading(false);
    };
    
    checkAccess();
  }, [isLoggedIn, authChecked, currentUserRole]);

  const handleRefresh = async () => {
    console.log("🔄 Refreshing advertising access...");
    setError(null);
    setIsLoading(true);
    
    // Try to refresh the session first
    try {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("❌ Session refresh error:", refreshError);
      } else {
        console.log("✅ Session refreshed successfully");
      }
    } catch (error) {
      console.error("❌ Session refresh failed:", error);
    }
    
    // Trigger storage event to reload data
    window.dispatchEvent(new Event('storage-event'));
    
    // Re-check access without reloading the page
    try {
      const subscriptionResult = await checkSubscription();
      console.log("🔄 Manual refresh subscription result:", subscriptionResult);
      
      if (subscriptionResult.error) {
        setError("Unable to verify subscription status. Please try again later.");
        setHasAccess(false);
      } else if (subscriptionResult.subscribed) {
        console.log("✅ User has active subscription after manual refresh");
        setHasAccess(true);
        setError(null);
      } else {
        console.log("⚠️ User does not have active subscription after manual refresh");
        setError("An active subscription is required to access advertising features");
        setHasAccess(false);
      }
    } catch (refreshError) {
      console.error("❌ Error during manual refresh:", refreshError);
      setError("Unable to verify subscription status. Please try again later.");
      setHasAccess(false);
    }
    
    setIsLoading(false);
  };

  return {
    error,
    isLoading,
    hasAccess,
    handleRefresh
  };
};
