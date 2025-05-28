
import { useAuth } from '@/hooks/useAuth';
import { useCallback } from 'react';

export function useCustomerAuth() {
  const auth = useAuth();
  
  const updateUserName = useCallback((newName: string) => {
    if (auth && typeof auth.updateUserName === 'function') {
      auth.updateUserName(newName);
    }
  }, [auth]);
  
  // Helper to get first name from email or regular name
  const getFirstName = useCallback((fullName: string) => {
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
  }, []);
  
  return {
    isCustomerLoggedIn: auth.isLoggedIn && auth.currentUserRole === 'customer',
    currentUserId: auth.user?.id || '',
    currentUserName: auth.currentUserName || 'Customer',
    currentUserRole: auth.currentUserRole,
    updateUserName,
    getFirstName,
    ...auth
  };
}
