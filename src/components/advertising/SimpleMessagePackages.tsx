
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

const messagePackages = [
  {
    id: '50-messages',
    quantity: 50,
    price: '$49.99',
    description: 'Perfect for getting started',
    paymentLink: 'https://buy.stripe.com/test_50_messages', // Replace with your actual Stripe Payment Link
    popular: false
  },
  {
    id: '200-messages',
    quantity: 200,
    price: '$99.99',
    description: 'Most popular choice',
    paymentLink: 'https://buy.stripe.com/test_200_messages', // Replace with your actual Stripe Payment Link
    popular: true
  },
  {
    id: '500-messages',
    quantity: 500,
    price: '$199.99',
    description: 'Best value for heavy users',
    paymentLink: 'https://buy.stripe.com/test_500_messages', // Replace with your actual Stripe Payment Link
    popular: false
  }
];

export const SimpleMessagePackages = () => {
  const handlePurchase = (paymentLink: string) => {
    // Open Stripe Payment Link in new tab
    window.open(paymentLink, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Message Packages</h2>
        <p className="text-muted-foreground mt-2">
          Purchase message credits to communicate with customers
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {messagePackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{pkg.quantity} Messages</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{pkg.price}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-center text-sm text-muted-foreground">
                <p>≈ ${(parseFloat(pkg.price.replace('$', '')) / pkg.quantity).toFixed(2)} per message</p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant={pkg.popular ? "default" : "outline"}
                onClick={() => handlePurchase(pkg.paymentLink)}
              >
                Purchase Package
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Messages never expire. One-time purchase, use anytime.</p>
      </div>
    </div>
  );
};
