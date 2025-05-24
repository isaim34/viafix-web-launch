
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

interface CheckoutActionProps {
  selectedPlan: string | null;
  currentPlan: string | null;
  isSubscribed: boolean;
  isLoading: boolean;
  onProceedToCheckout: () => void;
}

export const CheckoutAction: React.FC<CheckoutActionProps> = ({
  selectedPlan,
  currentPlan,
  isSubscribed,
  isLoading,
  onProceedToCheckout
}) => {
  if (!selectedPlan) {
    return null;
  }

  const isCurrentlySubscribedToPlan = selectedPlan === currentPlan && isSubscribed;

  return (
    <div className="flex justify-end">
      <Button 
        size="lg"
        onClick={onProceedToCheckout}
        disabled={isLoading || isCurrentlySubscribedToPlan}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            {isCurrentlySubscribedToPlan ? (
              "Already Subscribed"
            ) : (
              "Proceed to Checkout"
            )}
          </>
        )}
      </Button>
    </div>
  );
};
