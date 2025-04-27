
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getCustomerPortal } from '@/lib/stripe';
import { Settings, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const SubscriptionManagementSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLoggedIn, userEmail } = useAuth();

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Comprehensive authentication check
      if (!isLoggedIn || !userEmail) {
        console.log("Authentication check failed:", { isLoggedIn, userEmail });
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
      
      console.log("Attempting to access customer portal for:", userEmail);
      const { url, error: responseError } = await getCustomerPortal();
      
      if (responseError) {
        console.error("Portal access error:", responseError);
        setError(`Unable to access subscription portal: ${responseError}`);
        
        toast({
          title: "Unable to Access Portal",
          description: responseError,
          variant: "destructive"
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
      setError(`Unable to access subscription portal: ${errorMessage}`);
      
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
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your subscription plan, payment methods, and billing details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleManageSubscription}
            className="w-full sm:w-auto"
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-pulse mr-2">Loading...</span>
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
        </div>
      </CardContent>
    </Card>
  );
};
