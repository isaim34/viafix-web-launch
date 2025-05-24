
/**
 * Utility to clear all test data and reset the application to a fresh state
 */
export const clearAllTestData = () => {
  // Clear all localStorage items
  localStorage.clear();
  
  // Dispatch storage event to notify components of the change
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('storage-event'));
  
  console.log('All local storage data cleared');
};

/**
 * Clear specific user data from localStorage
 */
export const clearUserData = (email?: string, userName?: string) => {
  const keysToRemove = [
    'userLoggedIn',
    'userRole',
    'userName',
    'userId',
    'userEmail',
    'selectedRole',
    'pendingAuthRole',
    'vendorName',
    'vendorAvatar',
    'customerProfile',
    'mechanicProfile',
    'mechanicAvatar',
    'mechanic-avatar',
    'local-mechanic-avatar',
    'local-mechanic-name'
  ];

  // Remove general auth keys
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Remove user-specific keys if email provided
  if (email) {
    localStorage.removeItem(`customer_profile_${email}`);
    localStorage.removeItem(`mechanic_profile_${email}`);
    localStorage.removeItem(`registered_${email}`);
  }

  // Remove user-specific keys if userName provided
  if (userName) {
    // Search for keys that might contain the user name
    const allKeys = Object.keys(localStorage);
    const userSpecificKeys = allKeys.filter(key => 
      key.includes(userName.toLowerCase()) || 
      key.includes(userName.replace(' ', '.').toLowerCase()) ||
      key.includes(userName.replace(' ', '_').toLowerCase())
    );
    
    userSpecificKeys.forEach(key => localStorage.removeItem(key));
  }

  // Remove any customer-* or userId_to_email_* keys
  const allKeys = Object.keys(localStorage);
  const profileKeys = allKeys.filter(key => 
    key.startsWith('customer-') || 
    key.startsWith('userId_to_email_') ||
    key.startsWith('mechanic-')
  );
  
  profileKeys.forEach(key => localStorage.removeItem(key));

  // Also clear the default vendor data that might be cached
  localStorage.removeItem('default-vendor-data');
  localStorage.removeItem('isai-mercado-data');

  // Dispatch storage event to notify components
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('storage-event'));
  
  console.log('User-specific data cleared from localStorage');
};

/**
 * Clear all Isai Mercado related data thoroughly
 */
export const clearIsaiMercadoData = () => {
  // Clear by email variations
  clearUserData('isai@example.com', 'Isai Mercado');
  clearUserData('isai.mercado@example.com', 'Isai Mercado');
  
  // Additional specific keys for Isai Mercado
  const isaiKeys = [
    'isai-mercado-profile',
    'default-vendor-profile',
    'vendor-isai-mercado',
    'mechanic-isai-mercado'
  ];
  
  isaiKeys.forEach(key => localStorage.removeItem(key));
  
  // Clear any reviews associated with Isai Mercado
  const reviews = JSON.parse(localStorage.getItem('special_mechanic_reviews') || '[]');
  const filteredReviews = reviews.filter((review: any) => 
    !review.mechanic_id?.includes('isai') && 
    !review.mechanic_id?.includes('default-vendor') &&
    !review.mechanic_id?.includes('local-mechanic')
  );
  localStorage.setItem('special_mechanic_reviews', JSON.stringify(filteredReviews));
  
  console.log('Isai Mercado data cleared completely');
};
