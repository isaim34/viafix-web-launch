
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, DollarSign, CreditCard, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TrialStatusCardProps {
  signupDate?: Date;
}

export const TrialStatusCard: React.FC<TrialStatusCardProps> = ({ signupDate }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const calculateDaysSinceSignup = () => {
    if (!signupDate) return 0;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - signupDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysSinceSignup = calculateDaysSinceSignup();

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = () => {
    // Navigate to subscription page
    window.location.hash = '#advertising';
    setShowUpgradeModal(false);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 rounded-full p-2">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs md:text-sm font-medium text-green-700">Trial Status</p>
              <div className="flex items-center gap-2">
                <p className="text-lg md:text-2xl font-bold text-green-900">
                  FREE
                </p>
                <div className="text-xs text-green-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Day {daysSinceSignup}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Until first job
              </p>
              <Button
                onClick={handleUpgradeClick}
                variant="outline"
                size="sm"
                className="mt-2 h-6 text-xs border-green-300 text-green-700 hover:bg-green-50"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Confirmation Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              End Free Trial Early?
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <p className="font-medium text-gray-900">
                You're currently on day {daysSinceSignup} of your free trial.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium text-red-800 mb-2">❌ By upgrading now, you'll lose:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Your free trial period (worth $50/month)</li>
                  <li>• Risk-free platform testing</li>
                  <li>• Time to build your customer base</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">💡 Better option:</h4>
                <p className="text-sm text-blue-700">
                  Complete your first paid job to automatically activate your subscription. 
                  This way you'll know the platform works for your business before paying.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1"
            >
              Keep Free Trial
            </Button>
            <Button 
              onClick={handleConfirmUpgrade}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              End Trial & Subscribe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
