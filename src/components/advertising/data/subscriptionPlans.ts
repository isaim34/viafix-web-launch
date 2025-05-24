
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
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
