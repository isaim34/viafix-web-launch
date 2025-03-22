
import { useState, useEffect } from 'react';

export function useCustomerAuth() {
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  
  // Simulate checking if user is logged in as a customer
  useEffect(() => {
    // In a real app, this would check localStorage, cookies, or a state management store
    const checkUserAuth = () => {
      // Check if user is logged in and is a customer (not a mechanic)
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      
      setIsCustomerLoggedIn(userLoggedIn && userRole === 'customer');
    };
    
    checkUserAuth();
  }, []);

  return {
    isCustomerLoggedIn,
    // For demo purposes - in a real app, this would come from auth
    currentUserId: 'customer-123',
    currentUserName: 'Current Customer'
  };
}
