
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { getCustomerPortal } from '@/lib/stripe';
import { Settings, AlertCircle, ExternalLink, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const SubscriptionManagementSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [needsConfiguration, setNeedsConfiguration] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, userEmail } = useAuth();

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setRawError(null);
      setNeedsConfiguration(false);

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
      const { url, error: responseError, needsConfiguration: configNeeded, rawError: responseRawError, isAccountPage, message } = await getCustomerPortal();
      
      if (responseError) {
        console.error("Portal access error:", responseError);
        if (responseRawError) console.error("Raw error details:", responseRawError);
        
        setError(`${responseError}`);
        setRawError(responseRawError || null);
        setNeedsConfiguration(!!configNeeded);
        
        toast({
          variant: configNeeded ? "default" : "destructive",
          title: configNeeded ? "Portal Configuration Required" : "Unable to Access Portal",
          description: configNeeded ? 
            "The Stripe Customer Portal needs to be configured" : 
            responseError
        });
        return;
      }
      
      if (url) {
        if (isAccountPage) {
          toast({
            title: "Opening Stripe Account",
            description: message || "Customer Portal isn't set up yet. Opening Stripe account page instead.",
          });
        }
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
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your subscription plan, payment methods, and billing details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {needsConfiguration ? (
          <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              <div className="font-medium mb-1">Portal Configuration Required</div>
              <p className="text-sm mb-2">
                The Stripe Customer Portal needs to be configured before you can access it. A fallback option will be provided.
              </p>
              <a 
                href="https://dashboard.stripe.com/test/settings/billing/portal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center text-sm w-fit"
              >
                Configure Stripe Portal
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>
        ) : error && !needsConfiguration ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Error accessing portal</div>
              <p className="text-sm">{error}</p>
              {rawError && (
                <details className="mt-2 text-xs opacity-80">
                  <summary className="cursor-pointer">Technical details</summary>
                  <pre className="mt-1 p-2 bg-red-950/10 rounded overflow-auto">{rawError}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        ) : null}
        
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
      {needsConfiguration && (
        <CardFooter className="bg-gray-50 border-t px-6 py-4">
          <div className="text-sm text-gray-600 flex items-start">
            <Info className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <p>
              You'll be redirected to your Stripe account page as a fallback until the Customer Portal is configured.
              The portal allows your customers to manage their subscriptions, update payment methods, and view billing history.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
