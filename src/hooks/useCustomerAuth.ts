
import { useAuth } from './useAuth';
import { useState, useCallback, useEffect } from 'react';

export function useCustomerAuth() {
  const auth = useAuth();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Customer');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check auth status directly from localStorage
    const checkAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const storedUserName = localStorage.getItem('userName');
      const storedUserId = localStorage.getItem('userId');
      
      // Consider both customer and mechanic as valid logged-in users
      setIsCustomerLoggedIn(userLoggedIn && (userRole === 'customer' || userRole === 'mechanic'));
      if (storedUserName) setUserName(storedUserName);
      if (storedUserId) setUserId(storedUserId);
    };
    
    // Initial check
    checkAuth();
    
    // Update when auth state changes
    if (auth.currentUserName) {
      setUserName(auth.currentUserName);
    }
    
    // Ensure state is updated if localStorage changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage-event', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage-event', handleStorageChange);
    };
  }, [auth.currentUserName]);
  
  const updateUserName = useCallback((newName: string) => {
    localStorage.setItem('userName', newName);
    setUserName(newName);
    // Trigger a storage event for cross-tab updates
    window.dispatchEvent(new Event('storage-event'));
  }, []);
  
  return {
    ...auth,
    isCustomerLoggedIn: isCustomerLoggedIn,
    currentUserId: userId,
    currentUserName: userName,
    updateUserName,
  };
}
