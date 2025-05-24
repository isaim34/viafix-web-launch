
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkSubscription } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionRefresh = (loadSubscriptionData: () => void) => {
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Check for checkout success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'subscription') {
      toast({
        title: "Subscription purchase successful!",
        description: "Your subscription has been activated. Refreshing status...",
        variant: "default"
      });
      
      setTimeout(() => refreshSubscriptionStatus(), 2000);
    }
  }, []);

  const refreshSubscriptionStatus = async () => {
    try {
      setRefreshing(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      const userEmail = localStorage.getItem('userEmail');
      
      if (!session && (!isLoggedInLocally || !userEmail)) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your subscription status",
          variant: "destructive"
        });
        return;
      }
      
      const result = await checkSubscription();
      
      if (result.error) {
        toast({
          title: "Error checking subscription",
          description: result.error,
          variant: "destructive"
        });
      } else {
        loadSubscriptionData();
        
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
      setRefreshing(false);
    }
  };

  return {
    refreshing,
    refreshSubscriptionStatus
  };
};
