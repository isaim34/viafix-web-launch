
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession, checkSubscription } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      const userEmail = localStorage.getItem('userEmail');
      
      if (!session && (!isLoggedInLocally || !userEmail)) {
        setError("You need to be signed in to view subscription status");
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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setError(null);
  };

  const handleProceedToCheckout = async () => {
    if (!selectedPlan) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      const localUserEmail = localStorage.getItem('userEmail');
      
      if (!session && !isLoggedInLocally && !localUserEmail) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase a subscription plan",
          variant: "destructive"
        });
        navigate('/signin');
        return;
      }
      
      const { url, error, authError } = await createCheckoutSession({
        paymentType: 'subscription',
        planType: selectedPlan
      });
      
      if (authError) {
        console.error("Auth error from checkout:", authError);
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase a subscription plan",
          variant: "destructive"
        });
        navigate('/signin');
        return;
      }
      
      if (error) {
        throw new Error(error);
      }
      
      if (url) {
        toast({
          title: "Redirecting to checkout",
          description: "You'll be taken to our secure payment processor."
        });
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (err) {
      console.error('Subscription checkout error:', err);
      setError(err instanceof Error ? err.message : String(err));
      
      toast({
        title: "Checkout Error",
        description: err instanceof Error ? err.message : "Failed to initiate checkout",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedPlan,
    isLoading,
    error,
    refreshing,
    isLoadingSubscription,
    currentPlan,
    subscriptionStatus,
    subscriptionEnd,
    isSubscribed,
    refreshSubscriptionStatus,
    handleSelectPlan,
    handleProceedToCheckout
  };
};
