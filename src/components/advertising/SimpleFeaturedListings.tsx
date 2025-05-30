
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, Eye } from 'lucide-react';

const featuredPackages = [
  {
    id: '1-day',
    duration: '1 Day',
    price: '$9.99',
    description: 'Quick visibility boost',
    paymentLink: 'https://buy.stripe.com/test_1_day_featured', // Replace with your actual Stripe Payment Link
    popular: false
  },
  {
    id: '7-days',
    duration: '7 Days',
    price: '$62.93',
    originalPrice: '$69.93',
    description: 'Most popular choice',
    paymentLink: 'https://buy.stripe.com/test_7_days_featured', // Replace with your actual Stripe Payment Link
    popular: true,
    savings: '10% OFF'
  },
  {
    id: '30-days',
    duration: '30 Days',
    price: '$239.76',
    originalPrice: '$299.70',
    description: 'Maximum exposure',
    paymentLink: 'https://buy.stripe.com/test_30_days_featured', // Replace with your actual Stripe Payment Link
    popular: false,
    savings: '20% OFF'
  }
];

const benefits = [
  {
    icon: Star,
    title: 'Premium Placement',
    description: 'Appear at the top of search results'
  },
  {
    icon: TrendingUp,
    title: 'Increased Visibility',
    description: 'Get up to 3x more profile views'
  },
  {
    icon: Users,
    title: 'More Customers',
    description: 'Attract more potential clients'
  },
  {
    icon: Eye,
    title: 'Featured Badge',
    description: 'Stand out with a special badge'
  }
];

export const SimpleFeaturedListings = () => {
  const handlePurchase = (paymentLink: string) => {
    // Open Stripe Payment Link in new tab
    window.open(paymentLink, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Featured Listings</h2>
        <p className="text-muted-foreground mt-2">
          Boost your visibility and attract more customers
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            
            {pkg.savings && (
              <div className="absolute -top-3 -right-3">
                <Badge variant="destructive">{pkg.savings}</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">{pkg.duration}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{pkg.price}</span>
                {pkg.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    {pkg.originalPrice}
                  </span>
                )}
              </div>
            </CardHeader>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant={pkg.popular ? "default" : "outline"}
                onClick={() => handlePurchase(pkg.paymentLink)}
              >
                Get Featured
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
