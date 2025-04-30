
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { formatDate, formatPlanType } from './utils/subscriptionUtils';

interface SubscriptionStatusAlertProps {
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
}

export const SubscriptionStatusAlert = ({ 
  subscriptionTier, 
  subscriptionEnd 
}: SubscriptionStatusAlertProps) => {
  if (!subscriptionTier) return null;
  
  return (
    <Alert className="bg-green-50 border-green-200 text-green-800">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between w-full">
          <div>
            <p className="font-medium">Currently subscribed to the <span className="font-bold">{formatPlanType(subscriptionTier)}</span> plan</p>
            {subscriptionEnd && (
              <p className="text-sm text-green-700">Renews on {formatDate(subscriptionEnd)}</p>
            )}
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 self-start">
            Active
          </Badge>
        </div>
      </AlertDescription>
    </Alert>
  );
};
