
import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isMechanicLoggedIn, setIsMechanicLoggedIn] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Enhanced getFirstName function that handles both regular names and email addresses
  const getFirstName = useCallback((fullName: string) => {
    if (!fullName) return '';
    
    // Handle email addresses - extract username portion before @ symbol
    if (fullName.includes('@')) {
      const username = fullName.split('@')[0];
      // Capitalize first letter for better display
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    // Regular name - just take first part, ensure it's properly separated
    const parts = fullName.trim().split(' ');
    return parts[0] || '';
  }, []);

  useEffect(() => {
    const checkUserAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');
      
      // If the stored name is an email, check if we have a registered name for this email
      let storedName = userName || '';
      
      if (storedName.includes('@') && email) {
        // Try to get a registered name for this email
        const registeredName = localStorage.getItem(`registered_${email}`);
        if (registeredName) {
          storedName = registeredName;
          // Update localStorage immediately to fix the display for future renders
          localStorage.setItem('userName', registeredName);
        }
      }
      
      setIsCustomerLoggedIn(userLoggedIn && userRole === 'customer');
      setIsMechanicLoggedIn(userLoggedIn && userRole === 'mechanic');
      setCurrentUserName(storedName);
      setCurrentUserRole(userRole);
      setUserEmail(email);
      
      console.log('Auth state checked:', { userLoggedIn, userRole, userName: storedName, email });
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
    
    // If we have an email, update the registered name mapping
    const email = localStorage.getItem('userEmail');
    if (email) {
      localStorage.setItem(`registered_${email}`, trimmedName);
      
      // Try to update the profile if it exists
      try {
        const profileData = localStorage.getItem(`customer_profile_${email}`);
        if (profileData) {
          const profile = JSON.parse(profileData);
          const nameParts = trimmedName.split(' ');
          
          // Ensure proper name separation
          if (nameParts.length >= 1) {
            profile.firstName = nameParts[0] || '';
            profile.lastName = nameParts.slice(1).join(' ') || '';
          }
          
          localStorage.setItem(`customer_profile_${email}`, JSON.stringify(profile));
          localStorage.setItem('customerProfile', JSON.stringify(profile));
        }
      } catch (e) {
        console.error('Error updating profile with new name:', e);
      }
    }
    
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
    userEmail,
    updateUserName,
    getFirstName,
  };
}
