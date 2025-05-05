
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth';

/**
 * Hook to access authentication context
 * @returns AuthContext values
 */
export function useAuth() {
  return useContext(AuthContext);
}
