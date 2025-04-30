
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

  const price50 = (messageCost * 50).toFixed(2);
  const price200 = (messageCost * 200 * 0.9).toFixed(2);
  const price500 = (messageCost * 500 * 0.8).toFixed(2);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handlePackageClick(50)}>
          <CardHeader>
            <CardTitle>50 Messages</CardTitle>
            <CardDescription>${price50}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-primary shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => handlePackageClick(200)}>
          <CardHeader>
            <CardTitle>200 Messages</CardTitle>
            <CardDescription>${price200} (10% discount)</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Most Popular</Badge>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handlePackageClick(500)}>
          <CardHeader>
            <CardTitle>500 Messages</CardTitle>
            <CardDescription>${price500} (20% discount)</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>
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
                  {selectedPackage === 50 && `for $${price50}`}
                  {selectedPackage === 200 && `for $${price200} (10% discount)`}
                  {selectedPackage === 500 && `for $${price500} (20% discount)`}.
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
