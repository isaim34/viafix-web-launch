
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/auth';

/**
 * Hook to access authentication context with enhanced debugging
 * @returns AuthContext values
 */
export function useAuth() {
  const authContext = useContext(AuthContext);
  const [roleDetected, setRoleDetected] = useState<boolean>(false);

  // Add enhanced debug logging for role detection issues
  useEffect(() => {
    // Check if we have role in localStorage but not in context
    const localStorageRole = localStorage.getItem('userRole');
    const isLoggedInStorage = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    // Log authentication state for debugging
    console.debug('useAuth hook state:', {
      isLoggedIn: authContext.isLoggedIn,
      authChecked: authContext.authChecked,
      currentUserRole: authContext.currentUserRole || 'undefined',
      localStorageRole,
      localStorageLoggedIn: isLoggedInStorage,
      userName,
      userId: userId || 'not set'
    });
    
    // If we're logged in but missing role in context, try to use the localStorage role
    if (authContext.isLoggedIn && !authContext.currentUserRole && localStorageRole) {
      console.debug('Role missing in context but found in localStorage, triggering auth refresh');
      // Dispatch storage event to notify auth provider to update state from localStorage
      window.dispatchEvent(new Event('storage-event'));
      setRoleDetected(true);
    }
  }, [authContext.isLoggedIn, authContext.authChecked, authContext.currentUserRole]);

  return authContext;
}
