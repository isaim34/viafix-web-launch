
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
 * Now with improved reliability and timestamp
 */
export const updateLocalSubscriptionData = (data: any) => {
  if (data) {
    try {
      if (data.subscribed) {
        localStorage.setItem('subscription_status', 'active');
        localStorage.setItem('subscription_plan', data.subscription_tier || '');
        localStorage.setItem('subscription_end', data.subscription_end || '');
      } else {
        localStorage.setItem('subscription_status', 'inactive');
        localStorage.removeItem('subscription_plan');
        localStorage.removeItem('subscription_end');
      }
      
      // Add timestamp to prevent stale data and force refresh
      localStorage.setItem('subscription_updated_at', new Date().toISOString());
      
      // Dispatch storage event to notify components about the update
      window.dispatchEvent(new Event('storage-event'));
      
      console.log('Local subscription data updated:', {
        status: data.subscribed ? 'active' : 'inactive',
        tier: data.subscription_tier,
        end: data.subscription_end
      });
    } catch (err) {
      console.error('Error updating local subscription data:', err);
    }
  }
};

/**
 * Checks if the subscription data in localStorage is stale (older than 2 minutes)
 * Reduced from 5 minutes to ensure more frequent refreshes
 */
export const isSubscriptionDataStale = (): boolean => {
  const updatedAt = localStorage.getItem('subscription_updated_at');
  if (!updatedAt) return true;
  
  const lastUpdate = new Date(updatedAt).getTime();
  const now = new Date().getTime();
  const twoMinutesMs = 2 * 60 * 1000;
  
  return (now - lastUpdate) > twoMinutesMs;
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
  
  console.log('Local subscription data cleared');
};
