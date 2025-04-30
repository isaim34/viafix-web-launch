
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import { useSubscriptionStatus } from './hooks/useSubscriptionStatus';
import { SubscriptionStatusAlert } from './SubscriptionStatusAlert';
import { ErrorAlert } from './ErrorAlert';
import { PortalAccessButton } from './PortalAccessButton';

export const SubscriptionManagementSection = () => {
  const [error, setError] = useState<string | null>(null);
  const { 
    isAuthenticated, 
    isSubscribed, 
    isCheckingStatus, 
    subscriptionTier, 
    subscriptionEnd,
    refreshSubscriptionStatus 
  } = useSubscriptionStatus();

  return (
    <Card className={isSubscribed ? "border-green-100 bg-green-50/30" : "border-amber-100 bg-amber-50/20"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manage Your Subscription</CardTitle>
            <CardDescription>
              {isSubscribed 
                ? "Change your plan, update payment methods, or cancel your subscription" 
                : "You don't have an active subscription"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshSubscriptionStatus}
            disabled={isCheckingStatus}
            className="h-8 w-8 p-0"
            title="Refresh subscription status"
          >
            <RefreshCcw className={`h-4 w-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSubscribed && (
          <SubscriptionStatusAlert
            subscriptionTier={subscriptionTier}
            subscriptionEnd={subscriptionEnd}
          />
        )}
        
        <ErrorAlert error={error} />
        
        <PortalAccessButton 
          isSubscribed={isSubscribed} 
          isAuthenticated={isAuthenticated}
          setError={setError}
        />
      </CardContent>
    </Card>
  );
};
