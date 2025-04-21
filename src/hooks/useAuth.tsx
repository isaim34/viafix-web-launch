
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
      setCurrentUserName(userName || '');
      setCurrentUserRole(userRole);
      
      console.log('Auth state checked:', { userLoggedIn, userRole, userName });
    };
    
    checkUserAuth();
    
    // Setup event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', checkUserAuth);
    // Also listen for custom storage events dispatched within the app
    window.addEventListener('storage-event', checkUserAuth);
    
    return () => {
      window.removeEventListener('storage', checkUserAuth);
      window.removeEventListener('storage-event', checkUserAuth);
    };
  }, []);

  // Add function to update user name
  const updateUserName = (newName: string) => {
    if (!newName) return;
    
    // Ensure the name is properly formatted
    const trimmedName = newName.trim();
    if (trimmedName.length === 0) return;
    
    localStorage.setItem('userName', trimmedName);
    setCurrentUserName(trimmedName);
    
    // Trigger a storage event for cross-tab updates
    window.dispatchEvent(new Event('storage-event'));
    
    console.log('Username updated to:', trimmedName);
  };

  return {
    isCustomerLoggedIn,
    isMechanicLoggedIn,
    isLoggedIn: isCustomerLoggedIn || isMechanicLoggedIn,
    currentUserName,
    currentUserRole,
    updateUserName,
  };
}
