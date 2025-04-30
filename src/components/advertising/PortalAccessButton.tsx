
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink } from 'lucide-react';
import { getCustomerPortal } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PortalAccessButtonProps {
  isSubscribed: boolean;
  isAuthenticated: boolean;
  setError: (error: string | null) => void;
}

export const PortalAccessButton = ({ 
  isSubscribed, 
  isAuthenticated,
  setError
}: PortalAccessButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check authentication status directly
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        setError("You must be logged in to access subscription management");
        toast({
          title: "Authentication Required",
          description: "Please log in to manage your subscription",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Accessing Portal",
        description: "Opening subscription management portal...",
      });
      
      console.log("Attempting to access customer portal");
      const { url, error: responseError } = await getCustomerPortal();
      
      if (responseError) {
        console.error("Portal access error:", responseError);
        setError(`${responseError}`);
        
        toast({
          variant: "destructive",
          title: "Unable to Access Portal",
          description: responseError
        });
        return;
      }
      
      if (url) {
        window.open(url, '_blank') || window.location.assign(url);
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Failed to open subscription portal:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(`${errorMessage}`);
      
      toast({
        title: "Unable to Access Portal",
        description: "We couldn't connect to the subscription management portal. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleManageSubscription}
      className="w-full sm:w-auto"
      variant={isSubscribed ? "default" : "outline"}
      disabled={isLoading || !isAuthenticated}
    >
      {isLoading ? (
        <>
          <span className="animate-pulse mr-2">Opening Portal...</span>
          <Settings className="h-4 w-4 animate-spin" />
        </>
      ) : (
        <>
          <Settings className="mr-2 h-4 w-4" />
          {isSubscribed ? "Manage Subscription" : "Subscribe Now"}
          <ExternalLink className="ml-1 h-3 w-3" />
        </>
      )}
    </Button>
  );
};
