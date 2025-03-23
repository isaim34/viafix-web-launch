
import { useAuth } from './useAuth';
import { useState, useCallback } from 'react';

export function useCustomerAuth() {
  const auth = useAuth();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Customer');
  
  const updateUserName = useCallback((newName: string) => {
    localStorage.setItem('userName', newName);
    setUserName(newName);
    // Trigger a storage event for cross-tab updates
    window.dispatchEvent(new Event('storage'));
  }, []);
  
  return {
    ...auth,
    isCustomerLoggedIn: auth.isCustomerLoggedIn,
    currentUserId: localStorage.getItem('userId') || '',
    currentUserName: userName,
    updateUserName,
  };
}
