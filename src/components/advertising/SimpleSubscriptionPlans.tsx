
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$49.99',
    period: 'per month',
    description: 'Perfect for getting started',
    features: [
      'Unlimited service listings',
      'Customer messaging',
      'Basic analytics',
      'Mobile app access'
    ],
    paymentLink: 'https://buy.stripe.com/test_monthly_plan', // Replace with your actual Stripe Payment Link
    popular: false
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: '$134.97',
    period: 'every 3 months',
    description: 'Most popular choice',
    features: [
      'Everything in Monthly',
      'Priority customer support',
      'Advanced analytics',
      'Featured listing badge'
    ],
    paymentLink: 'https://buy.stripe.com/test_quarterly_plan', // Replace with your actual Stripe Payment Link
    popular: true
  },
  {
    id: 'biannual',
    name: 'Bi-Annual',
    price: '$254.94',
    period: 'every 6 months',
    description: 'Great value for committed mechanics',
    features: [
      'Everything in Quarterly',
      'Custom branding options',
      'API access',
      'Dedicated account manager'
    ],
    paymentLink: 'https://buy.stripe.com/test_biannual_plan', // Replace with your actual Stripe Payment Link
    popular: false
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$479.88',
    period: 'per year',
    description: 'Best value for serious professionals',
    features: [
      'Everything in Bi-Annual',
      'White-label solution',
      'Custom integrations',
      'Premium support'
    ],
    paymentLink: 'https://buy.stripe.com/test_annual_plan', // Replace with your actual Stripe Payment Link
    popular: false
  }
];

export const SimpleSubscriptionPlans = () => {
  const handleSubscribe = (paymentLink: string) => {
    // Open Stripe Payment Link in new tab
    window.open(paymentLink, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Select the perfect subscription plan for your mechanic business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.paymentLink)}
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>All plans include a 14-day free trial. Cancel anytime.</p>
      </div>
    </div>
  );
};
