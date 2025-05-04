
import { useCallback } from 'react';
import type { UserRole } from '@/contexts/auth/types';

export type { UserRole };

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
