
export const checkLocalAuth = () => {
  const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');
  
  return {
    isLoggedInLocally: isLoggedInLocally && !!userEmail && !!userRole,
    userEmail,
    userRole
  };
};

export const updateLocalSubscriptionData = (data: any) => {
  if (data) {
    localStorage.setItem('subscription_status', data.subscribed ? 'active' : 'inactive');
    localStorage.setItem('subscription_plan', data.subscription_tier || '');
    localStorage.setItem('subscription_end', data.subscription_end || '');
    localStorage.setItem('subscription_updated_at', new Date().toISOString());
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage-event'));
  }
};

export const isSubscriptionDataStale = (): boolean => {
  const lastUpdated = localStorage.getItem('subscription_updated_at');
  if (!lastUpdated) return true;
  
  const lastUpdateTime = new Date(lastUpdated).getTime();
  const now = new Date().getTime();
  const fiveMinutes = 5 * 60 * 1000;
  
  return (now - lastUpdateTime) > fiveMinutes;
};
