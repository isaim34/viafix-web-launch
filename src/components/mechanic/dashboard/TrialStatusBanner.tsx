
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, CheckCircle, ArrowRight, CreditCard, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TrialStatusBannerProps {
  onOptimizeProfile?: () => void;
  onViewGigs?: () => void;
}

export const TrialStatusBanner: React.FC<TrialStatusBannerProps> = ({ 
  onOptimizeProfile, 
  onViewGigs 
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Trial Status Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    Trial Period Active
                  </Badge>
                  <Badge variant="outline" className="text-green-700 border-green-200">
                    Free Until First Job
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Complete Your First Job to Activate Full Benefits!
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  Your account is completely free until you complete and get paid for your first job. 
                  Try everything risk-free with full platform access.
                </p>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Account Setup</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <div className="flex items-center gap-1 text-blue-600 font-medium">
                    <Clock className="h-3 w-3" />
                    <span>First Job</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <div className="flex items-center gap-1 text-gray-400">
                    <Star className="h-3 w-3" />
                    <span>Subscription Active</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-col xl:flex-row">
                <Button 
                  onClick={onOptimizeProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  size="sm"
                >
                  <Star className="h-4 w-4" />
                  Optimize Profile
                </Button>
                <Button 
                  onClick={onViewGigs}
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 gap-2"
                  size="sm"
                >
                  <ArrowRight className="h-4 w-4" />
                  View My Gigs
                </Button>
                <Button 
                  onClick={handleUpgradeClick}
                  variant="outline" 
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 gap-2"
                  size="sm"
                >
                  <CreditCard className="h-4 w-4" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Confirmation Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Opt Out of Free Trial?
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <p className="font-medium text-gray-900">
                Are you sure you want to purchase a subscription now?
              </p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <h4 className="font-medium text-orange-800 mb-2">⚠️ You'll be giving up:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• <strong>Free trial period</strong> - No charges until first job</li>
                  <li>• <strong>Risk-free testing</strong> - Full platform access at no cost</li>
                  <li>• <strong>Flexibility</strong> - Ability to try before you commit</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">✅ You'll get:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Immediate subscription benefits</strong></li>
                  <li>• <strong>Priority support</strong></li>
                  <li>• <strong>Advanced features</strong> (if any)</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                <strong>Recommendation:</strong> Most mechanics prefer to complete their first job 
                before subscribing to ensure the platform works for their business.
              </p>
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
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Purchase Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
