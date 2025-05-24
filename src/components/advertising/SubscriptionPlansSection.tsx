
import React from 'react';
import { Loader2 } from 'lucide-react';
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
