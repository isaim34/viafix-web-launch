
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getCustomerPortal } from '@/lib/stripe';
import { Settings, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SubscriptionManagementSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);

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
    <Card className="border-green-100 bg-green-50/30">
      <CardHeader>
        <CardTitle>Manage Your Subscription</CardTitle>
        <CardDescription>
          Change your plan, update payment methods, or cancel your subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Error accessing portal</div>
              <p className="text-sm">{error}</p>
            </AlertDescription>
          </Alert>
        ) : null}
        
        <Button 
          onClick={handleManageSubscription}
          className="w-full sm:w-auto"
          variant="default"
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
              Manage Subscription
              <ExternalLink className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
