
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
      
      // For mechanics, check subscription status
      try {
        const subscriptionResult = await checkSubscription();
        console.log("📦 Subscription check result:", subscriptionResult);
        
        if (subscriptionResult.error && subscriptionResult.authError) {
          setError("Authentication required. Please sign in again.");
          setHasAccess(false);
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

  const handleRefresh = () => {
    console.log("🔄 Refreshing advertising access...");
    setError(null);
    setIsLoading(true);
    window.dispatchEvent(new Event('storage-event'));
  };

  return {
    error,
    isLoading,
    hasAccess,
    handleRefresh
  };
};
