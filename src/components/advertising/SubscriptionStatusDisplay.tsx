
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldCheck, RefreshCcw, AlertCircle } from 'lucide-react';

interface SubscriptionStatusDisplayProps {
  isSubscribed: boolean;
  currentPlan: string | null;
  subscriptionEnd: string | null;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
}

const getPlanLabel = (planId: string): string => {
  switch(planId) {
    case 'monthly': return 'Monthly';
    case 'quarterly': return 'Quarterly';
    case 'biannual': return 'Bi-Annual';
    case 'annual': return 'Annual';
    default: return planId;
  }
};

export const SubscriptionStatusDisplay: React.FC<SubscriptionStatusDisplayProps> = ({
  isSubscribed,
  currentPlan,
  subscriptionEnd,
  error,
  refreshing,
  onRefresh
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Subscription Plans</h2>
          <p className="text-muted-foreground">Choose a subscription plan to unlock premium features</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </Button>
      </div>
      
      {isSubscribed && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="font-medium">You're currently subscribed to the {getPlanLabel(currentPlan || '')} plan</div>
            {subscriptionEnd && (
              <p className="text-sm mt-1">
                Your subscription renews on {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
