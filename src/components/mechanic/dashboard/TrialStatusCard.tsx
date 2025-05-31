
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, DollarSign } from 'lucide-react';

interface TrialStatusCardProps {
  signupDate?: Date;
}

export const TrialStatusCard: React.FC<TrialStatusCardProps> = ({ signupDate }) => {
  const calculateDaysSinceSignup = () => {
    if (!signupDate) return 0;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - signupDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysSinceSignup = calculateDaysSinceSignup();

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 rounded-full p-2">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
