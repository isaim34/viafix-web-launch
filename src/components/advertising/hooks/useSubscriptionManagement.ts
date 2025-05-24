
import { useState } from 'react';
import { useSubscriptionData } from './useSubscriptionData';
import { useCheckoutOperations } from './useCheckoutOperations';
import { useSubscriptionRefresh } from './useSubscriptionRefresh';

export const useSubscriptionManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const {
    isLoadingSubscription,
    currentPlan,
    subscriptionStatus,
    subscriptionEnd,
    isSubscribed,
    error,
    setError,
    loadSubscriptionData
  } = useSubscriptionData();

  const { isLoading, handleProceedToCheckout: checkoutHandler } = useCheckoutOperations();
  const { refreshing, refreshSubscriptionStatus } = useSubscriptionRefresh(loadSubscriptionData);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setError(null);
  };

  const handleProceedToCheckout = async () => {
    try {
      await checkoutHandler(selectedPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return {
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
  };
};
