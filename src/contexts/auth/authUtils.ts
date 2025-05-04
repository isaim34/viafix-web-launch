
/**
 * Get the first name from a full name or email
 * @param fullName The full name or email
 * @returns The first name
 */
export const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  
  // Handle email addresses - extract username portion before @ symbol
  if (fullName.includes('@')) {
    const username = fullName.split('@')[0];
    // Capitalize first letter for better display
    return username.charAt(0).toUpperCase() + username.slice(1);
  }
  
  // Regular name - just take first part
  const parts = fullName.trim().split(' ');
  return parts[0] || '';
};

/**
 * Clear authentication state from localStorage
 */
export const clearLocalAuthState = (): void => {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
};
