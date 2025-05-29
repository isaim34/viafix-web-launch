
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { createCheckoutSession } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

export interface MessagePackagesSectionProps {
  messageCost: number;
  messagesRemaining: number;
  onBuyMessages: (quantity: number) => void;
}

export const MessagePackagesSection: React.FC<MessagePackagesSectionProps> = ({
  messageCost,
  messagesRemaining,
  onBuyMessages
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handlePackageClick = (quantity: number) => {
    setSelectedPackage(quantity);
    setIsConfirmDialogOpen(true);
  };
  
  const handleConfirmPurchase = async () => {
    if (selectedPackage) {
      try {
        setError(null);
        const { url, error: checkoutError } = await createCheckoutSession({
          paymentType: 'messages',
          quantity: selectedPackage
        });
        
        if (checkoutError) {
          setError(checkoutError);
          toast({
            title: "Error",
            description: checkoutError,
            variant: "destructive"
          });
          return;
        }
        
        if (url) {
          window.location.href = url;
        }
      } catch (err) {
        console.error('Payment error:', err);
        setError(err instanceof Error ? err.message : "Unknown error");
        toast({
          title: "Error",
          description: "Failed to initiate checkout. Please try again.",
          variant: "destructive"
        });
      }
    }
    setIsConfirmDialogOpen(false);
  };

  // Updated pricing to match new Stripe products
  const packages = [
    { quantity: 50, price: 49.99, description: "Perfect for getting started" },
    { quantity: 200, price: 99.99, description: "Most popular choice", popular: true },
    { quantity: 500, price: 199.99, description: "Best value for heavy users" }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {packages.map((pkg) => (
          <Card 
            key={pkg.quantity}
            className={`${pkg.popular ? 'border-primary shadow-sm' : 'border-dashed'} hover:border-primary/50 transition-colors cursor-pointer`}
            onClick={() => handlePackageClick(pkg.quantity)}
          >
            <CardHeader>
              <CardTitle>{pkg.quantity} Messages</CardTitle>
              <CardDescription>${pkg.price}</CardDescription>
            </CardHeader>
            {pkg.popular && (
              <CardContent>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Most Popular</Badge>
              </CardContent>
            )}
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant={pkg.popular ? "default" : "outline"} className="w-full">
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <p>Messages available: <span className="font-medium">{messagesRemaining}</span></p>
        {messagesRemaining === 0 && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Purchase messages to continue
          </Badge>
        )}
      </div>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPackage && (
                <>
                  You are about to purchase {selectedPackage} messages{' '}
                  {selectedPackage === 50 && `for $49.99`}
                  {selectedPackage === 200 && `for $99.99`}
                  {selectedPackage === 500 && `for $199.99`}.
                  Would you like to proceed?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPurchase}>Confirm Purchase</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
