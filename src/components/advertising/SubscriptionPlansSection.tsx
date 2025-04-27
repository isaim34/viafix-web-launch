
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, CreditCard, ShieldCheck } from 'lucide-react';
import { createCheckoutSession } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Current subscription info from localStorage
  const currentPlan = localStorage.getItem('subscription_plan');
  const subscriptionStatus = localStorage.getItem('subscription_status');
  const subscriptionEnd = localStorage.getItem('subscription_end');
  const isSubscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
  
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
  
  const handleProceedToCheckout = async () => {
    if (!selectedPlan) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { url, error, authError } = await createCheckoutSession({
        paymentType: 'subscription',
        planType: selectedPlan
      });
      
      if (authError) {
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
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      
      toast({
        title: "Checkout Error",
        description: err instanceof Error ? err.message : "Failed to initiate checkout",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Subscription Plans</h2>
        <p className="text-muted-foreground">Choose a subscription plan to unlock premium features</p>
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
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
