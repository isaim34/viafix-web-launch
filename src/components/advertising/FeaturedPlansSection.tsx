
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { FeaturedPlanCard } from './FeaturedPlanCard';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface SelectedPlan {
  days: number;
  price: number;
  title: string;
}

export interface FeaturedPlansSectionProps {
  featuredDailyPrice: number;
  onPurchaseFeatured: (days: number) => void;
}

export const FeaturedPlansSection: React.FC<FeaturedPlansSectionProps> = ({
  featuredDailyPrice,
  onPurchaseFeatured
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
        setError(null);
        
        const { url, error: checkoutError, authError } = await createCheckoutSession({
          paymentType: 'featured',
          quantity: selectedPlan.days
        });

        if (authError) {
          setError("Authentication required");
          toast({
            title: "Authentication Required",
            description: "Please sign in to purchase a featured plan",
            variant: "destructive"
          });
          navigate('/signin');
          return;
        }

        if (checkoutError) {
          setError(checkoutError);
          throw new Error(checkoutError);
        }
        
        if (url) {
          window.location.href = url;
        }
      } catch (err) {
        console.error('Payment error:', err);
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to initiate checkout",
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
          price={9.99}
          description="Get featured in the homepage for 24 hours"
          days={1}
          isSelected={selectedPlan?.days === 1}
          onSelect={() => handleSelectPlan({
            days: 1,
            price: 9.99,
            title: "1 Day Spotlight"
          })}
        />
        
        <FeaturedPlanCard 
          title="Weekly Spotlight"
          price={62.94}
          description="Get featured in the homepage for 7 days"
          days={7}
          isSelected={selectedPlan?.days === 7}
          onSelect={() => handleSelectPlan({
            days: 7,
            price: 62.94,
            title: "Weekly Spotlight"
          })}
          recommended
        />
        
        <FeaturedPlanCard 
          title="Monthly Spotlight"
          price={239.76}
          description="Get featured in the homepage for 30 days"
          days={30}
          isSelected={selectedPlan?.days === 30}
          onSelect={() => handleSelectPlan({
            days: 30,
            price: 239.76,
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
