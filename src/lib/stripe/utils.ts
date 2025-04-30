
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
