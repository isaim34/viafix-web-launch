
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/auth';

/**
 * Hook to access authentication context
 * @returns AuthContext values
 */
export function useAuth() {
  const authContext = useContext(AuthContext);

  // Add debug logging for role detection issues
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('useAuth hook state:', {
        isLoggedIn: authContext.isLoggedIn,
        authChecked: authContext.authChecked,
        currentUserRole: authContext.currentUserRole,
        localStorageRole: localStorage.getItem('userRole'),
        localStorageLoggedIn: localStorage.getItem('userLoggedIn'),
      });
    }
  }, [authContext.isLoggedIn, authContext.authChecked, authContext.currentUserRole]);

  return authContext;
}
