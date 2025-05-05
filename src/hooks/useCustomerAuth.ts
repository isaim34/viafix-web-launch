
import { useAuth } from '@/hooks/useAuth';
import { useState, useCallback, useEffect } from 'react';

export function useCustomerAuth() {
  const auth = useAuth();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Customer');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || 'customer-123');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Enhanced auth status check
    const checkAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const storedUserName = localStorage.getItem('userName');
      let storedUserId = localStorage.getItem('userId');
      
      // Ensure userId is always set for storage consistency
      if (!storedUserId && userLoggedIn && userRole === 'customer') {
        storedUserId = 'customer-123';
        localStorage.setItem('userId', storedUserId);
      }
      
      // More robust login state determination
      const isValidLogin = userLoggedIn && 
        (userRole === 'customer' || userRole === 'mechanic') && 
        !!storedUserId; // Ensure userId is present
      
      setIsCustomerLoggedIn(isValidLogin);
      setCurrentUserRole(userRole);
      
      if (storedUserName) setUserName(storedUserName);
      if (storedUserId) setUserId(storedUserId);
      
      console.log('Auth check:', { 
        userLoggedIn, 
        userRole, 
        isValidLogin, 
        userId: storedUserId,
        userName: storedUserName
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
    // Use the auth.updateUserName for consistent behavior
    if (auth && typeof auth.updateUserName === 'function') {
      auth.updateUserName(newName);
    }
    setUserName(newName);
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
    isCustomerLoggedIn,
    currentUserId: userId,
    currentUserName: userName,
    currentUserRole,
    updateUserName,
    getFirstName,
    // Safely spread auth properties, making sure auth is an object
    ...(auth && typeof auth === 'object' ? auth : {})
  };
}
