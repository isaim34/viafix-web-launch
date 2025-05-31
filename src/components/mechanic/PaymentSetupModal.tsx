
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Star, Zap, AlertTriangle, Gift } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethodSetup } from './PaymentMethodSetup';
import { SpotlightPackageSelector } from './SpotlightPackageSelector';

interface PaymentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  mechanicData: any;
}

export const PaymentSetupModal: React.FC<PaymentSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  mechanicData
}) => {
  const [currentStep, setCurrentStep] = useState<'payment' | 'spotlight' | 'complete'>('payment');
  const [paymentSetupComplete, setPaymentSetupComplete] = useState(false);
  const [selectedSpotlight, setSelectedSpotlight] = useState<string | null>(null);

  const handlePaymentMethodSaved = () => {
    console.log('Payment method saved successfully');
    setPaymentSetupComplete(true);
    toast({
      title: "Payment method added!",
      description: "Your payment method has been securely saved.",
    });
    setCurrentStep('spotlight');
  };

  const handleSpotlightPurchase = async (spotlightType: string) => {
    try {
      console.log('Purchasing spotlight package:', spotlightType);
      
      const { data, error } = await supabase.functions.invoke('mechanic-spotlight-purchase', {
        body: { spotlight_type: spotlightType }
      });

      if (error) {
        console.error('Spotlight purchase error:', error);
        throw error;
      }

      console.log('Spotlight purchase response:', data);
      setSelectedSpotlight(spotlightType);
      
      toast({
        title: "Spotlight activated!",
        description: `Your ${spotlightType} spotlight package is now active.`,
      });
      
      setCurrentStep('complete');
    } catch (error: any) {
      console.error('Spotlight purchase error:', error);
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to activate spotlight package. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSkipSpotlight = () => {
    console.log('Skipping spotlight package');
    setCurrentStep('complete');
  };

  const handleFinish = () => {
    console.log('Finishing payment setup modal');
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Complete Your Mechanic Setup</DialogTitle>
        </DialogHeader>

        {currentStep === 'payment' && (
          <div className="space-y-6">
            {/* Trial Benefits Banner */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">🎉 Trial Period Benefits</h4>
                  <div className="text-sm text-green-700 mt-1 space-y-1">
                    <p>✅ <strong>Full platform access</strong> - Use all features immediately</p>
                    <p>✅ <strong>No charges until first job</strong> - Try everything risk-free</p>
                    <p>✅ <strong>Unlimited profile setup</strong> - Take your time to get it right</p>
                    <p>✅ <strong>Customer interaction tools</strong> - Chat, quotes, and booking</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method Setup
                </CardTitle>
                <CardDescription>
                  Add a payment method to secure your account. Your $50/month subscription 
                  will only start after you complete your first paid job.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodSetup onSuccess={handlePaymentMethodSaved} />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'spotlight' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Boost Your Visibility (Optional)
                </CardTitle>
                <CardDescription>
                  Get more customers with our Spotlight packages. You can always add these later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpotlightPackageSelector 
                  onPurchase={handleSpotlightPurchase}
                  onSkip={handleSkipSpotlight}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Welcome to ViaFix!</h3>
              <p className="text-gray-600 mb-4">
                Your mechanic account is now set up and ready to go.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-2">🎉 Trial Period Active:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• <strong>Complete access</strong> to all platform features</p>
                  <p>• <strong>$0 monthly fee</strong> until your first paid job</p>
                  <p>• <strong>Try everything risk-free</strong> - no time limits</p>
                  <p>• <strong>$50/month subscription</strong> starts only after first job completion</p>
                </div>
              </div>

              {selectedSpotlight && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Spotlight Active</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your {selectedSpotlight} spotlight package is now boosting your profile visibility.
                  </p>
                </div>
              )}
            </div>
            
            <Button onClick={handleFinish} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
