
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isMechanicLoggedIn, setIsMechanicLoggedIn] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  // Check auth status on component mount
  useEffect(() => {
    const checkUserAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      
      setIsCustomerLoggedIn(userLoggedIn && userRole === 'customer');
      setIsMechanicLoggedIn(userLoggedIn && userRole === 'mechanic');
      setCurrentUserName(userName || 'User');
      setCurrentUserRole(userRole);
    };
    
    checkUserAuth();
    
    // Setup event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', checkUserAuth);
    return () => {
      window.removeEventListener('storage', checkUserAuth);
    };
  }, []);

  return {
    isCustomerLoggedIn,
    isMechanicLoggedIn,
    isLoggedIn: isCustomerLoggedIn || isMechanicLoggedIn,
    currentUserName,
    currentUserRole,
  };
}
