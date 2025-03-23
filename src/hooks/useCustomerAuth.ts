
import { useAuth } from './useAuth';
import { useState, useCallback, useEffect } from 'react';

export function useCustomerAuth() {
  const auth = useAuth();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Customer');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  
  useEffect(() => {
    // Ensure state is updated if localStorage changes
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('userName') || 'Customer');
      setUserId(localStorage.getItem('userId') || '');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const updateUserName = useCallback((newName: string) => {
    localStorage.setItem('userName', newName);
    setUserName(newName);
    // Trigger a storage event for cross-tab updates
    window.dispatchEvent(new Event('storage'));
  }, []);
  
  return {
    ...auth,
    isCustomerLoggedIn: auth.isCustomerLoggedIn,
    currentUserId: userId,
    currentUserName: userName,
    updateUserName,
  };
}
