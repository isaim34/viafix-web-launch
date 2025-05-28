
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth';

/**
 * Hook to access authentication context
 * @returns AuthContext values
 */
export function useAuth() {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
}
