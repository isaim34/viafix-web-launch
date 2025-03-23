import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { FeaturedPlanCard } from './FeaturedPlanCard';
import { Button } from '@/components/ui/button';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const handleSelectPlan = (plan: SelectedPlan) => {
    setSelectedPlan(prev => {
      // If this plan is already selected, toggle it off
      if (prev?.days === plan.days) {
        return null;
      }
      // Otherwise, select this plan (replacing any previously selected plan)
      return plan;
    });
  };
  
  const handleProceedToPayment = () => {
    if (selectedPlan) {
      setShowPaymentDialog(true);
    }
  };
  
  const handleCompletePurchase = (paymentMethodId: string) => {
    if (selectedPlan) {
      onPurchaseFeatured(selectedPlan.days);
      setSelectedPlan(null);
      setShowPaymentDialog(false);
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
          <Button onClick={handleProceedToPayment}>
            Proceed to Payment
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
      
      {/* Payment Method Selection Dialog */}
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Your Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="font-medium">Selected Plan:</p>
                  {selectedPlan && (
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{selectedPlan.title}</span>
                        <span>${selectedPlan.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>${selectedPlan.price.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <PaymentMethodSelector 
                  onSelectMethod={handleCompletePurchase}
                  confirmButtonText={selectedPlan ? `Pay $${selectedPlan.price.toFixed(2)}` : "Pay"}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
