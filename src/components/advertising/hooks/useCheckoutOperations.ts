
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

export const useCheckoutOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceedToCheckout = async (selectedPlan: string | null) => {
    if (!selectedPlan) return;
    
    try {
      setIsLoading(true);
      
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
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      toast({
        title: "Checkout Error",
        description: errorMessage,
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
