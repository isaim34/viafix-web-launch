
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Star, CreditCard, CheckCircle } from 'lucide-react';
import { PaymentMethodSelector } from './PaymentMethodSelector';

interface FeaturedPlanCardProps {
  title: string;
  price: number;
  description: string;
  days: number;
  recommended?: boolean;
  onPurchase: (days: number) => void;
}

export const FeaturedPlanCard: React.FC<FeaturedPlanCardProps> = ({
  title,
  price,
  description,
  days,
  recommended = false,
  onPurchase
}) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handlePurchase = () => {
    setShowPaymentDialog(true);
  };
  
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      // After showing success message, close dialog and call onPurchase
      setTimeout(() => {
        setShowPaymentDialog(false);
        setIsComplete(false);
        onPurchase(days);
      }, 1500);
    }, 2000);
  };

  return (
    <>
      <Card className={`${recommended ? 'border-primary shadow-sm hover:shadow-md' : 'border-dashed hover:border-primary/50'} transition-all`}>
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
            variant={recommended ? "default" : "outline"} 
            className="w-full flex items-center gap-2"
            onClick={handlePurchase}
          >
            <Star className={`h-4 w-4 ${recommended ? 'fill-white' : ''}`} />
            Get Featured
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isComplete ? 'Payment Successful!' : 'Complete Your Purchase'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isComplete ? (
                <div className="flex flex-col items-center py-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-center">Your profile will be featured for {days} {days === 1 ? 'day' : 'days'}</p>
                </div>
              ) : (
                <>
                  <p className="mb-4">{title} - ${price.toFixed(2)}</p>
                  <PaymentMethodSelector />
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {!isComplete && (
            <AlertDialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentDialog(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay ${price.toFixed(2)}
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
