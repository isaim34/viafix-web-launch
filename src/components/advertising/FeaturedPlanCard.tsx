
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';

interface FeaturedPlanCardProps {
  title: string;
  price: number;
  description: string;
  days: number;
  recommended?: boolean;
  isSelected?: boolean;
  onSelect: () => void;
}

export const FeaturedPlanCard: React.FC<FeaturedPlanCardProps> = ({
  title,
  price,
  description,
  days,
  recommended = false,
  isSelected = false,
  onSelect
}) => {
  return (
    <Card 
      className={`
        ${recommended ? 'border-primary shadow-sm hover:shadow-md' : 'border-dashed hover:border-primary/50'} 
        ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
        transition-all cursor-pointer
      `}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>${price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        {recommended && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Best Value
          </Badge>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant={isSelected ? "default" : (recommended ? "outline" : "secondary")}
          className="w-full flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4" />
              Selected
            </>
          ) : (
            <>
              <Star className={`h-4 w-4`} />
              Select Plan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
