
import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isMechanicLoggedIn, setIsMechanicLoggedIn] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  const getFirstName = useCallback((fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    return parts[0] || '';
  }, []);

  useEffect(() => {
    const checkUserAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      
      // Get user name or use default if not found
      const storedName = userName || '';
      
      setIsCustomerLoggedIn(userLoggedIn && userRole === 'customer');
      setIsMechanicLoggedIn(userLoggedIn && userRole === 'mechanic');
      setCurrentUserName(storedName);
      setCurrentUserRole(userRole);
      
      console.log('Auth state checked:', { userLoggedIn, userRole, userName: storedName });
    };
    
    // Initial auth check
    checkUserAuth();
    
    // Listen for storage events for cross-tab sync
    window.addEventListener('storage', checkUserAuth);
    // Listen for custom storage events within the app
    window.addEventListener('storage-event', checkUserAuth);
    
    return () => {
      window.removeEventListener('storage', checkUserAuth);
      window.removeEventListener('storage-event', checkUserAuth);
    };
  }, []);

  const updateUserName = useCallback((newName: string) => {
    if (!newName) return;
    
    const trimmedName = newName.trim();
    if (trimmedName.length === 0) return;
    
    // Store the full name in localStorage
    localStorage.setItem('userName', trimmedName);
    setCurrentUserName(trimmedName);
    
    // Dispatch storage event for cross-component updates
    window.dispatchEvent(new Event('storage-event'));
    
    console.log('Username updated to:', trimmedName);
  }, []);

  return {
    isCustomerLoggedIn,
    isMechanicLoggedIn,
    isLoggedIn: isCustomerLoggedIn || isMechanicLoggedIn,
    currentUserName,
    currentUserRole,
    updateUserName,
    getFirstName,
  };
}
