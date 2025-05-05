
/**
 * Utility functions for authentication
 */

export const getFirstName = (name?: string): string => {
  if (!name) return '';
  
  // Handle email addresses - extract username portion before @ symbol
  if (name.includes('@')) {
    const username = name.split('@')[0];
    // Capitalize first letter for better display
    return username.charAt(0).toUpperCase() + username.slice(1);
  }
  
  // Regular name - just take first part
  const parts = name.trim().split(' ');
  return parts[0] || '';
};

export const clearLocalAuthState = (): void => {
  // Authentication related items
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  
  // Profile related items that should be cleared on logout
  localStorage.removeItem('customerProfile');
  localStorage.removeItem('mechanicProfile');
  localStorage.removeItem('customerAvatar');
  localStorage.removeItem('mechanicAvatar');
  localStorage.removeItem('mechanic-avatar');
  localStorage.removeItem('vendorAvatar');
  localStorage.removeItem('vendorName');
};

export const persistUserToLocalStorage = (userData: {
  id?: string | null;
  email?: string | null;
  role?: string | null;
  name?: string | null;
}): void => {
  if (userData.id) localStorage.setItem('userId', userData.id);
  if (userData.email) localStorage.setItem('userEmail', userData.email);
  if (userData.role) localStorage.setItem('userRole', userData.role);
  if (userData.name) localStorage.setItem('userName', userData.name);
  localStorage.setItem('userLoggedIn', 'true');
  
  // Trigger storage event for components listening to authentication changes
  window.dispatchEvent(new Event('storage-event'));
  
  console.log('User data persisted to localStorage:', {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    name: userData.name
  });
};
