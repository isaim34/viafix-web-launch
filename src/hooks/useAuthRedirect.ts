
import { useCallback } from 'react';
import { UserRole } from '@/contexts/auth';

export { UserRole };

export const useAuthRedirect = () => {
  const getProfileRoute = useCallback((userRole: UserRole): string => {
    switch(userRole) {
      case 'customer':
        return '/customer-profile';
      case 'mechanic':
        return '/mechanic-dashboard';
      default:
        return '/';
    }
  }, []);

  return { getProfileRoute };
};
