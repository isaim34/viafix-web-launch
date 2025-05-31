
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb, Users } from 'lucide-react';

interface TrialAwareGigHeaderProps {
  onAddGig: () => void;
  gigCount: number;
}

export const TrialAwareGigHeader: React.FC<TrialAwareGigHeaderProps> = ({ 
  onAddGig, 
  gigCount 
}) => {
  const shouldShowTrialTip = gigCount === 0;

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-gray-600">
            Create and manage your automotive services
          </p>
        </div>
        <Button onClick={onAddGig} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Service
        </Button>
      </div>

      {/* Trial Period Tip */}
      {shouldShowTrialTip && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 rounded-full p-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-1">
                  Trial Period Tip: Create Your First Service
                </h4>
                <p className="text-sm text-amber-700 mb-3">
                  Add services to your profile to start attracting customers. 
                  The more detailed your services, the more likely customers are to book with you.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <Users className="h-3 w-3" />
                  <span>Popular services: Oil Change, Brake Repair, Diagnostics</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
