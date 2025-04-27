
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { getCustomerPortal } from '@/lib/stripe';
import { Settings, AlertCircle, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const SubscriptionManagementSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminAction, setAdminAction] = useState(false);
  const [setupUrl, setSetupUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLoggedIn, userEmail } = useAuth();

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAdminAction(false);
      setSetupUrl(null);

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
      const { url, error: responseError, adminAction: isAdminAction, setupUrl: portalSetupUrl } = await getCustomerPortal();
      
      if (responseError) {
        console.error("Portal access error:", responseError);
        setAdminAction(!!isAdminAction);
        if (isAdminAction && portalSetupUrl) {
          setSetupUrl(portalSetupUrl);
        }
        throw new Error(responseError);
      }
      
      if (url) {
        window.open(url, '_blank') || window.location.assign(url);
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Failed to open subscription portal:", error);
      
      // More descriptive error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error connecting to subscription portal";
      
      setError("Unable to access subscription portal. Please try again later or contact support.");
      
      toast({
        title: "Unable to Access Portal",
        description: adminAction 
          ? "The Stripe Customer Portal needs to be configured in your Stripe Dashboard." 
          : "We couldn't connect to the subscription management portal. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenStripeSetup = () => {
    if (setupUrl) {
      window.open(setupUrl, '_blank');
    } else {
      window.open('https://dashboard.stripe.com/test/settings/billing/portal', '_blank');
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
              {adminAction && (
                <div className="mt-2">
                  <strong>Admin Action Required:</strong> You need to configure the Customer Portal in your Stripe Dashboard before it can be used.
                </div>
              )}
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
          
          {adminAction && setupUrl && (
            <Button 
              onClick={handleOpenStripeSetup} 
              variant="secondary" 
              className="w-full sm:w-auto"
            >
              Configure in Stripe
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      
      {adminAction && (
        <CardFooter className="bg-muted/50 px-6 py-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Administrator Notice:</p>
            <p>The Stripe Customer Portal requires configuration in the Stripe Dashboard before it can be used. 
            Click the "Configure in Stripe" button above to set it up.</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
