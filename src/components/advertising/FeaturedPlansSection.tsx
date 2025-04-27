
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { FeaturedPlanCard } from './FeaturedPlanCard';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/stripe';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface SelectedPlan {
  days: number;
  price: number;
  title: string;
}

interface FeaturedPlansSectionProps {
  featuredDailyPrice: number;
  onPurchaseFeatured: (days: number) => void;
}

export const FeaturedPlansSection: React.FC<FeaturedPlansSectionProps> = ({
  featuredDailyPrice,
  onPurchaseFeatured
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSelectPlan = (plan: SelectedPlan) => {
    setSelectedPlan(prev => {
      if (prev?.days === plan.days) {
        return null;
      }
      return plan;
    });
  };
  
  const handleProceedToPayment = async () => {
    if (selectedPlan) {
      try {
        setIsLoading(true);
        
        const { url, error, authError } = await createCheckoutSession({
          paymentType: 'featured',
          quantity: selectedPlan.days
        });

        if (authError) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to purchase a featured plan",
            variant: "destructive"
          });
          navigate('/signin');
          return;
        }

        if (error) {
          throw new Error(error);
        }
        
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Payment error:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to initiate checkout",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeaturedPlanCard 
          title="1 Day Spotlight"
          price={featuredDailyPrice}
          description="Get featured in the homepage for 24 hours"
          days={1}
          isSelected={selectedPlan?.days === 1}
          onSelect={() => handleSelectPlan({
            days: 1,
            price: featuredDailyPrice,
            title: "1 Day Spotlight"
          })}
        />
        
        <FeaturedPlanCard 
          title="Weekly Spotlight"
          price={featuredDailyPrice * 7 * 0.9}
          description="Get featured in the homepage for 7 days (10% discount)"
          days={7}
          isSelected={selectedPlan?.days === 7}
          onSelect={() => handleSelectPlan({
            days: 7,
            price: featuredDailyPrice * 7 * 0.9,
            title: "Weekly Spotlight"
          })}
          recommended
        />
        
        <FeaturedPlanCard 
          title="Monthly Spotlight"
          price={featuredDailyPrice * 30 * 0.8}
          description="Get featured in the homepage for 30 days (20% discount)"
          days={30}
          isSelected={selectedPlan?.days === 30}
          onSelect={() => handleSelectPlan({
            days: 30,
            price: featuredDailyPrice * 30 * 0.8,
            title: "Monthly Spotlight"
          })}
        />
      </div>
      
      {selectedPlan && (
        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border">
          <div>
            <p className="font-medium">Selected plan: {selectedPlan.title}</p>
            <p className="text-sm text-muted-foreground">Total: ${selectedPlan.price.toFixed(2)}</p>
          </div>
          <Button 
            onClick={handleProceedToPayment}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefits of Being Featured</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Prominent placement on the homepage</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Higher visibility in search results</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Featured badge on your profile</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Up to 3x more profile views</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
