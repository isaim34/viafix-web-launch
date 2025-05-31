
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Crown } from 'lucide-react';

interface SpotlightPackageSelectorProps {
  onPurchase: (spotlightType: string) => void;
  onSkip: () => void;
}

const SPOTLIGHT_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Spotlight',
    price: '$9.99',
    duration: '1 day',
    icon: Star,
    features: [
      'Higher visibility in search results',
      'Basic priority placement',
      'Increased profile views'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium Spotlight',
    price: '$62.94',
    duration: '7 days',
    icon: Zap,
    features: [
      'Top priority in search results',
      'Featured mechanic badge',
      'Premium profile highlighting',
      '2x more visibility than basic'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Spotlight',
    price: '$239.76',
    duration: '30 days',
    icon: Crown,
    features: [
      'Maximum visibility boost',
      'Featured on homepage',
      'Priority customer matching',
      'Enhanced profile features',
      'Dedicated support'
    ],
    popular: false
  }
];

export const SpotlightPackageSelector: React.FC<SpotlightPackageSelectorProps> = ({ 
  onPurchase, 
  onSkip 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {SPOTLIGHT_PACKAGES.map((pkg) => {
          const IconComponent = pkg.icon;
          return (
            <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  Best Value
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                  <CardDescription>{pkg.duration}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => onPurchase(pkg.id)} 
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  Choose {pkg.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Don't want to boost your visibility right now? You can always add Spotlight packages later.
        </p>
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
      </div>
    </div>
  );
};
