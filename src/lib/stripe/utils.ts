
/**
 * Helper function to check authentication status from local storage
 */
export const checkLocalAuth = () => {
  const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  
  return { isLoggedInLocally, userEmail };
};

/**
 * Store subscription info in localStorage for easy access
 */
export const updateLocalSubscriptionData = (data: any) => {
  if (data) {
    if (data.subscribed) {
      localStorage.setItem('subscription_status', 'active');
      localStorage.setItem('subscription_plan', data.subscription_tier || '');
      localStorage.setItem('subscription_end', data.subscription_end || '');
      
      // Add timestamp to prevent stale data
      localStorage.setItem('subscription_updated_at', new Date().toISOString());
    } else {
      localStorage.setItem('subscription_status', 'inactive');
      localStorage.removeItem('subscription_plan');
      localStorage.removeItem('subscription_end');
      localStorage.setItem('subscription_updated_at', new Date().toISOString());
    }
    
    // Dispatch storage event to notify components about the update
    window.dispatchEvent(new Event('storage-event'));
  }
};

/**
 * Checks if the subscription data in localStorage is stale (older than 5 minutes)
 */
export const isSubscriptionDataStale = (): boolean => {
  const updatedAt = localStorage.getItem('subscription_updated_at');
  if (!updatedAt) return true;
  
  const lastUpdate = new Date(updatedAt).getTime();
  const now = new Date().getTime();
  const fiveMinutesMs = 5 * 60 * 1000;
  
  return (now - lastUpdate) > fiveMinutesMs;
};

/**
 * Clear all subscription data from localStorage
 */
export const clearSubscriptionData = () => {
  localStorage.removeItem('subscription_status');
  localStorage.removeItem('subscription_plan');
  localStorage.removeItem('subscription_end');
  localStorage.removeItem('subscription_updated_at');
  
  // Dispatch storage event to notify components
  window.dispatchEvent(new Event('storage-event'));
};
