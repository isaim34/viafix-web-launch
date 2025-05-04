
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, CreditCard, ShieldCheck, RefreshCcw, AlertCircle, Loader2 } from 'lucide-react';
import { createCheckoutSession, checkSubscription } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const SubscriptionPlansSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = useAuth();
  
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  
  const isSubscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';

  // Load subscription data from localStorage and check with Stripe
  useEffect(() => {
    const loadSubscriptionData = () => {
      setCurrentPlan(localStorage.getItem('subscription_plan'));
      setSubscriptionStatus(localStorage.getItem('subscription_status'));
      setSubscriptionEnd(localStorage.getItem('subscription_end'));
    };

    const checkAuth = async () => {
      try {
        // Set auth checked first to avoid showing signin error message prematurely
        setAuthChecked(true);
        
        // First try to get session from Supabase
        const { data } = await supabase.auth.getSession();
        const isAuthenticated = !!data.session;
        
        // Also check local authentication as fallback
        const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');
        const hasLocalAuth = isLoggedInLocally && userRole && userEmail;
        
        // If neither Supabase nor local auth is present, show error
        if (!isAuthenticated && !hasLocalAuth) {
          console.warn("No authentication found");
          setError("You need to be signed in to view subscription status");
          setIsLoadingSubscription(false);
          return;
        }
        
        // If we have any form of authentication, proceed with subscription check
        console.log("Using authentication: ", {
          supabase: isAuthenticated, 
          local: hasLocalAuth
        });
        
        // Check subscription status with Stripe
        setIsLoadingSubscription(true);
        const result = await checkSubscription();
        
        if (result.error) {
          console.error("Error checking subscription:", result.error);
          if (result.authError) {
            setError("Authentication error when checking subscription status. Please try signing out and back in.");
          } else {
            setError(`Error checking subscription status: ${result.error}`);
          }
        }
        
        // Load data from localStorage (which should be updated by checkSubscription)
        loadSubscriptionData();
        setIsLoadingSubscription(false);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoadingSubscription(false);
      }
    };
    
    loadSubscriptionData();
    checkAuth();
    
    window.addEventListener('storage', loadSubscriptionData);
    window.addEventListener('storage-event', loadSubscriptionData);
    
    return () => {
      window.removeEventListener('storage', loadSubscriptionData);
      window.removeEventListener('storage-event', loadSubscriptionData);
    };
  }, []);
  
  const plans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 50,
      billing: 'per month',
      description: 'Perfect for trying out our premium features',
      features: [
        'Priority listing in search results',
        'Messaging with unlimited customers',
        'Access to FixIQ vehicle intelligence',
        'Enhanced profile customization'
      ]
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: 45,
      billing: 'per month, billed quarterly at $135',
      description: 'Save 10% with quarterly billing',
      features: [
        'All Monthly plan features',
        '10% savings compared to monthly plan',
        'Extended analytics dashboard',
        'Premium customer support'
      ],
      recommended: true
    },
    {
      id: 'biannual',
      name: 'Bi-Annual',
      price: 42.50,
      billing: 'per month, billed bi-annually at $255',
      description: 'Save 15% with bi-annual billing',
      features: [
        'All Quarterly plan features',
        '15% savings compared to monthly plan',
        'Featured mechanic spotlight once per month',
        'Early access to new features'
      ]
    },
    {
      id: 'annual',
      name: 'Annual',
      price: 40,
      billing: 'per month, billed annually at $480',
      description: 'Our best value subscription plan',
      features: [
        'All Bi-Annual plan features',
        '20% savings compared to monthly plan',
        'AI-powered job matching service',
        'Dedicated account manager'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setError(null);
  };
  
  const getPlanLabel = (planId: string): string => {
    switch(planId) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'biannual': return 'Bi-Annual';
      case 'annual': return 'Annual';
      default: return planId;
    }
  };
  
  const refreshSubscriptionStatus = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // First try Supabase auth
      const { data: { session } } = await supabase.auth.getSession();
      
      // Then check local auth as backup
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      const userEmail = localStorage.getItem('userEmail');
      
      // If neither authentication method works, show error
      if (!session && (!isLoggedInLocally || !userEmail)) {
        setError("You need to be signed in to view subscription status");
        toast({
          title: "Authentication required",
          description: "Please sign in to view your subscription status",
          variant: "destructive"
        });
        setRefreshing(false);
        return;
      }
      
      // Check subscription status with Stripe
      const result = await checkSubscription();
      
      if (result.error) {
        toast({
          title: "Error checking subscription",
          description: result.error,
          variant: "destructive"
        });
      } else {
        // Load updated data from localStorage
        setCurrentPlan(localStorage.getItem('subscription_plan'));
        setSubscriptionStatus(localStorage.getItem('subscription_status'));
        setSubscriptionEnd(localStorage.getItem('subscription_end'));
        
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
  
  const handleProceedToCheckout = async () => {
    if (!selectedPlan) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Check auth status in all possible ways
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
      
      // Pass local auth email as an explicit option
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
  
  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading subscription status...</p>
        </div>
      </div>
    );
  }
  
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex gap-2">
          <div className="h-4 w-4 bg-slate-300 rounded-full"></div>
          <div className="h-4 w-4 bg-slate-300 rounded-full"></div>
          <div className="h-4 w-4 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  // Add auto-refresh when returning from checkout
  useEffect(() => {
    const checkURLForCheckoutSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'subscription') {
        toast({
          title: "Subscription purchase successful!",
          description: "Your subscription has been activated. Refreshing status...",
          variant: "default"
        });
        
        // Short delay before refreshing to allow Stripe to process the payment
        setTimeout(() => refreshSubscriptionStatus(), 2000);
      }
    };
    
    checkURLForCheckoutSuccess();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Subscription Plans</h2>
          <p className="text-muted-foreground">Choose a subscription plan to unlock premium features</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={refreshSubscriptionStatus}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </Button>
      </div>
      
      {isSubscribed && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="font-medium">You're currently subscribed to the {getPlanLabel(currentPlan || '')} plan</div>
            {subscriptionEnd && (
              <p className="text-sm mt-1">
                Your subscription renews on {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${
              plan.recommended ? 'border-primary shadow-md' : selectedPlan === plan.id ? 'ring-2 ring-primary border-primary' : 'border'
            } ${currentPlan === plan.id && isSubscribed ? 'bg-green-50' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                <Badge className="bg-primary">Best Value</Badge>
              </div>
            )}
            
            {currentPlan === plan.id && isSubscribed && (
              <div className="absolute top-0 left-0 -translate-x-2 -translate-y-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Current Plan
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.billing}</span>
                </div>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={currentPlan === plan.id && isSubscribed ? "outline" : plan.recommended ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSelectPlan(plan.id)}
                disabled={currentPlan === plan.id && isSubscribed}
              >
                {currentPlan === plan.id && isSubscribed ? (
                  "Current Plan"
                ) : selectedPlan === plan.id ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Selected
                  </span>
                ) : (
                  "Select Plan"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {selectedPlan && (
        <div className="flex justify-end">
          <Button 
            size="lg"
            onClick={handleProceedToCheckout}
            disabled={isLoading || (selectedPlan === currentPlan && isSubscribed)}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                {selectedPlan === currentPlan && isSubscribed ? (
                  "Already Subscribed"
                ) : (
                  "Proceed to Checkout"
                )}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
