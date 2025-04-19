
import { useAuth } from './useAuth';
import { useState, useCallback, useEffect } from 'react';

export function useCustomerAuth() {
  const auth = useAuth();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Customer');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Enhanced auth status check
    const checkAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const storedUserName = localStorage.getItem('userName');
      const storedUserId = localStorage.getItem('userId');
      
      // More robust login state determination
      const isValidLogin = userLoggedIn && 
        (userRole === 'customer' || userRole === 'mechanic') && 
        !!storedUserId; // Ensure userId is present and convert to boolean
      
      setIsCustomerLoggedIn(isValidLogin);
      setCurrentUserRole(userRole);
      
      if (storedUserName) setUserName(storedUserName);
      if (storedUserId) setUserId(storedUserId);
      
      console.log('Auth check:', { 
        userLoggedIn, 
        userRole, 
        isValidLogin, 
        userId: storedUserId 
      });
    };
    
    // Initial and subsequent checks
    checkAuth();
    
    // Update listeners
    window.addEventListener('storage', checkAuth);
    window.addEventListener('storage-event', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('storage-event', checkAuth);
    };
  }, []);
  
  const updateUserName = useCallback((newName: string) => {
    localStorage.setItem('userName', newName);
    setUserName(newName);
    window.dispatchEvent(new Event('storage-event'));
  }, []);
  
  return {
    ...auth,
    isCustomerLoggedIn: isCustomerLoggedIn,
    currentUserId: userId,
    currentUserName: userName,
    currentUserRole: currentUserRole,
    updateUserName,
  };
}
