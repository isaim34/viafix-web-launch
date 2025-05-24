
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { CheckoutResult } from '@/lib/stripe/types';

export const useCheckoutOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceedToCheckout = async (selectedPlan: string | null) => {
    if (!selectedPlan) {
      console.error("No plan selected");
      toast({
        title: "Plan Selection Required",
        description: "Please select a subscription plan before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Starting checkout process for plan:", selectedPlan);
      
      const { data: { session } } = await supabase.auth.getSession();
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      const localUserEmail = localStorage.getItem('userEmail');
      
      console.log("Auth status:", { 
        hasSession: !!session, 
        isLoggedInLocally, 
        hasLocalEmail: !!localUserEmail 
      });
      
      if (!session && !isLoggedInLocally && !localUserEmail) {
        console.error("No authentication found");
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase a subscription plan",
          variant: "destructive"
        });
        navigate('/signin');
        return;
      }
      
      console.log("Calling createCheckoutSession...");
      
      // Add timeout handling for the checkout session creation
      const timeoutPromise = new Promise<CheckoutResult>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - please try again')), 30000);
      });
      
      const checkoutPromise = createCheckoutSession({
        paymentType: 'subscription',
        planType: selectedPlan
      });
      
      const result = await Promise.race([checkoutPromise, timeoutPromise]);
      
      console.log("Checkout session result:", result);
      
      if (result.authError) {
        console.error("Auth error from checkout:", result.authError);
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase a subscription plan",
          variant: "destructive"
        });
        navigate('/signin');
        return;
      }
      
      if (result.error) {
        console.error("Checkout error:", result.error);
        throw new Error(result.error);
      }
      
      if (result.url) {
        console.log("Redirecting to Stripe checkout:", result.url);
        toast({
          title: "Redirecting to checkout",
          description: "You'll be taken to our secure payment processor."
        });
        
        // Add a small delay to ensure the toast is visible, then redirect
        setTimeout(() => {
          // Use window.location.href for better compatibility
          window.location.href = result.url;
        }, 1500);
      } else {
        console.error("No checkout URL received");
        throw new Error("Failed to create checkout session - no URL returned");
      }
    } catch (err) {
      console.error('Subscription checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Show user-friendly error messages
      let userMessage = errorMessage;
      if (errorMessage.includes('timeout')) {
        userMessage = "The request timed out. Please check your connection and try again.";
      } else if (errorMessage.includes('network')) {
        userMessage = "Network error. Please check your connection and try again.";
      } else if (errorMessage.includes('Authentication')) {
        userMessage = "Please sign in and try again.";
      } else if (errorMessage.includes('Invalid request format')) {
        userMessage = "There was a problem with your request. Please try again.";
      }
      
      toast({
        title: "Checkout Error",
        description: userMessage,
        variant: "destructive"
      });
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleProceedToCheckout
  };
};
