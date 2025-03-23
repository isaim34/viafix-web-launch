
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Star, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handlePurchase = () => {
    setShowPaymentDialog(true);
  };
  
  const handleProceedToConfirmation = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
    setShowPaymentDialog(false);
    setShowConfirmDialog(true);
  };
  
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      // After showing success message, close dialog and call onPurchase
      setTimeout(() => {
        setShowConfirmDialog(false);
        setIsComplete(false);
        onPurchase(days);
      }, 1500);
    }, 2000);
  };
  
  const handleCancelConfirmation = () => {
    setShowConfirmDialog(false);
    setShowPaymentDialog(true);
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
      
      {/* Payment Method Selection Dialog */}
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Select Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">{title} - ${price.toFixed(2)}</p>
              <PaymentMethodSelector 
                onSelectMethod={handleProceedToConfirmation}
              />
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
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isComplete ? 'Payment Successful!' : 'Confirm Your Purchase'}
            </DialogTitle>
            <DialogDescription>
              {isComplete ? (
                <div className="flex flex-col items-center py-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-center">Your profile will be featured for {days} {days === 1 ? 'day' : 'days'}</p>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="flex flex-col space-y-1 border-b pb-4">
                    <span className="font-medium">{title}</span>
                    <span className="text-sm text-muted-foreground">{description}</span>
                    <span className="text-lg font-semibold mt-2">${price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Payment Method ending in •••• 4242</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowConfirmDialog(false);
                        setShowPaymentDialog(true);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-md flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Secure Transaction</p>
                      <p className="text-muted-foreground">Your payment information is protected and this purchase is covered by our satisfaction guarantee.</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {!isComplete && (
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleCancelConfirmation}
                disabled={isProcessing}
              >
                Back
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
                    Confirm Payment (${price.toFixed(2)})
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

