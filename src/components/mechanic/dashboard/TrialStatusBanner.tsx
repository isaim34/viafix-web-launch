
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrialStatusBannerProps {
  onOptimizeProfile?: () => void;
  onViewGigs?: () => void;
}

export const TrialStatusBanner: React.FC<TrialStatusBannerProps> = ({ 
  onOptimizeProfile, 
  onViewGigs 
}) => {
  return (
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
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
