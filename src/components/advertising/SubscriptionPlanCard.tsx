
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  selectedPlan: string | null;
  currentPlan: string | null;
  isSubscribed: boolean;
  onSelectPlan: (planId: string) => void;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  selectedPlan,
  currentPlan,
  isSubscribed,
  onSelectPlan
}) => {
  const isCurrentPlan = currentPlan === plan.id && isSubscribed;
  const isSelected = selectedPlan === plan.id;

  return (
    <Card 
      className={`relative ${
        plan.recommended ? 'border-primary shadow-md' : isSelected ? 'ring-2 ring-primary border-primary' : 'border'
      } ${isCurrentPlan ? 'bg-green-50' : ''}`}
    >
      {plan.recommended && (
        <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
          <Badge className="bg-primary">Best Value</Badge>
        </div>
      )}
      
      {isCurrentPlan && (
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
          variant={isCurrentPlan ? "outline" : plan.recommended ? "default" : "outline"}
          className="w-full"
          onClick={() => onSelectPlan(plan.id)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? (
            "Current Plan"
          ) : isSelected ? (
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
  );
};
