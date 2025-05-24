
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

  // Dispatch storage event to notify components
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('storage-event'));
  
  console.log('User-specific data cleared from localStorage');
};
