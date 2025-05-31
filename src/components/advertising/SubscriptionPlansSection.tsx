
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptionManagement } from './hooks/useSubscriptionManagement';
import { SubscriptionStatusDisplay } from './SubscriptionStatusDisplay';
import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import { CheckoutAction } from './CheckoutAction';
import { subscriptionPlans } from './data/subscriptionPlans';

export const SubscriptionPlansSection = () => {
  const {
    selectedPlan,
    isLoading,
    error,
    refreshing,
    isLoadingSubscription,
    currentPlan,
    subscriptionStatus,
    subscriptionEnd,
    isSubscribed,
    refreshSubscriptionStatus,
    handleSelectPlan,
    handleProceedToCheckout
  } = useSubscriptionManagement();
  
  // Check if user is likely in trial period (no subscription but has local auth)
  const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  const isInTrialPeriod = isLoggedInLocally && userRole === 'mechanic' && !isSubscribed;
  
  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading subscription status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Trial Period Warning */}
      {isInTrialPeriod && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              You're Currently in Your Free Trial Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">🎉 Trial Benefits You're Enjoying:</h4>
              <ul className="text-sm text-orange-800 space-y-1 mb-3">
                <li>• <strong>$0 monthly fee</strong> until your first paid job</li>
                <li>• <strong>Full platform access</strong> - no feature restrictions</li>
                <li>• <strong>Unlimited profile setup</strong> and customization</li>
                <li>• <strong>Customer interaction tools</strong> - chat, quotes, booking</li>
                <li>• <strong>Risk-free testing</strong> - try everything before paying</li>
              </ul>
              
              <div className="bg-orange-100 border border-orange-300 rounded p-3 mt-3">
                <p className="text-sm text-orange-900">
                  <strong>💡 Recommendation:</strong> Complete your first job to activate your subscription automatically. 
                  This ensures the platform works for your business before any charges begin.
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Important:</h4>
              <p className="text-sm text-red-700">
                Purchasing a subscription now will <strong>end your free trial immediately</strong> and 
                you'll be charged the monthly fee regardless of whether you've completed any jobs.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <SubscriptionStatusDisplay
        isSubscribed={isSubscribed}
        currentPlan={currentPlan}
        subscriptionEnd={subscriptionEnd}
        error={error}
        refreshing={refreshing}
        onRefresh={refreshSubscriptionStatus}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionPlans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            plan={plan}
            selectedPlan={selectedPlan}
            currentPlan={currentPlan}
            isSubscribed={isSubscribed}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
      
      <CheckoutAction
        selectedPlan={selectedPlan}
        currentPlan={currentPlan}
        isSubscribed={isSubscribed}
        isLoading={isLoading}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
};
