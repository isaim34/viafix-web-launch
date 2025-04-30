
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getCustomerPortal, checkSubscription } from '@/lib/stripe';
import { Settings, AlertCircle, ExternalLink, RefreshCcw, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SubscriptionManagementSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const { toast } = useToast();

  // Check authentication and subscription status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        setIsAuthenticated(hasSession);
        
        if (hasSession) {
          // Check if user has an active subscription
          setIsCheckingStatus(true);
          const result = await checkSubscription();
          setIsSubscribed(result.subscribed || false);
          setSubscriptionTier(result.subscription_tier || localStorage.getItem('subscription_plan'));
          setSubscriptionEnd(result.subscription_end || localStorage.getItem('subscription_end'));
          setIsCheckingStatus(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsCheckingStatus(false);
      }
    };
    
    checkAuth();
    
    // Listen for storage events that might update subscription status
    const handleStorageEvent = () => {
      const status = localStorage.getItem('subscription_status');
      const plan = localStorage.getItem('subscription_plan');
      const endDate = localStorage.getItem('subscription_end');
      
      setIsSubscribed(status === 'active' || status === 'trialing');
      setSubscriptionTier(plan || null);
      setSubscriptionEnd(endDate || null);
    };
    
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storage-event', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('storage-event', handleStorageEvent);
    };
  }, []);
  
  const refreshSubscriptionStatus = async () => {
    try {
      setIsCheckingStatus(true);
      setError(null);
      
      const result = await checkSubscription();
      
      if (result.error) {
        toast({
          title: "Error checking subscription",
          description: result.error,
          variant: "destructive"
        });
      } else {
        setIsSubscribed(result.subscribed || false);
        setSubscriptionTier(result.subscription_tier);
        setSubscriptionEnd(result.subscription_end);
        
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
      setIsCheckingStatus(false);
    }
  };

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

  // Format the subscription end date nicely
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  // Format plan type to be more readable
  const formatPlanType = (plan: string | null) => {
    if (!plan) return '';
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  return (
    <Card className={isSubscribed ? "border-green-100 bg-green-50/30" : "border-amber-100 bg-amber-50/20"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manage Your Subscription</CardTitle>
            <CardDescription>
              {isSubscribed 
                ? "Change your plan, update payment methods, or cancel your subscription" 
                : "You don't have an active subscription"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshSubscriptionStatus}
            disabled={isCheckingStatus}
            className="h-8 w-8 p-0"
            title="Refresh subscription status"
          >
            <RefreshCcw className={`h-4 w-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSubscribed && subscriptionTier && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between w-full">
                <div>
                  <p className="font-medium">Currently subscribed to the <span className="font-bold">{formatPlanType(subscriptionTier)}</span> plan</p>
                  {subscriptionEnd && (
                    <p className="text-sm text-green-700">Renews on {formatDate(subscriptionEnd)}</p>
                  )}
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 self-start">
                  Active
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
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
      </CardContent>
    </Card>
  );
};
