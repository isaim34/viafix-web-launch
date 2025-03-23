
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
  const [selectedPlans, setSelectedPlans] = useState<SelectedPlan[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const handlePlanToggle = (plan: SelectedPlan) => {
    setSelectedPlans(prev => {
      // Check if this plan is already selected
      const existingPlanIndex = prev.findIndex(p => p.days === plan.days);
      
      if (existingPlanIndex >= 0) {
        // Remove the plan if it's already selected
        return prev.filter(p => p.days !== plan.days);
      } else {
        // Add the plan if it's not selected
        return [...prev, plan];
      }
    });
  };
  
  const handleProceedToPayment = () => {
    if (selectedPlans.length > 0) {
      setShowPaymentDialog(true);
    }
  };
  
  const totalAmount = selectedPlans.reduce((sum, plan) => sum + plan.price, 0);
  
  const handleCompletePurchase = (paymentMethodId: string) => {
    // Process each selected plan
    selectedPlans.forEach(plan => {
      onPurchaseFeatured(plan.days);
    });
    
    setSelectedPlans([]);
    setShowPaymentDialog(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeaturedPlanCard 
          title="1 Day Spotlight"
          price={featuredDailyPrice}
          description="Get featured in the homepage for 24 hours"
          days={1}
          isSelected={selectedPlans.some(p => p.days === 1)}
          onToggleSelect={() => handlePlanToggle({
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
          isSelected={selectedPlans.some(p => p.days === 7)}
          onToggleSelect={() => handlePlanToggle({
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
          isSelected={selectedPlans.some(p => p.days === 30)}
          onToggleSelect={() => handlePlanToggle({
            days: 30,
            price: featuredDailyPrice * 30 * 0.8,
            title: "Monthly Spotlight"
          })}
        />
      </div>
      
      {selectedPlans.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border">
          <div>
            <p className="font-medium">Selected plans: {selectedPlans.length}</p>
            <p className="text-sm text-muted-foreground">Total: ${totalAmount.toFixed(2)}</p>
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
                  <p className="font-medium">Selected Plans:</p>
                  <ul className="mt-2 space-y-2">
                    {selectedPlans.map((plan, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{plan.title}</span>
                        <span>${plan.price.toFixed(2)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
                
                <PaymentMethodSelector 
                  onSelectMethod={handleCompletePurchase}
                  confirmButtonText={`Pay $${totalAmount.toFixed(2)}`}
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
