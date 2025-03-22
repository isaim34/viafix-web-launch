
import { useAuth } from './useAuth';

export function useCustomerAuth() {
  const auth = useAuth();
  
  return {
    ...auth,
    isCustomerLoggedIn: auth.isCustomerLoggedIn,
    currentUserId: localStorage.getItem('userId') || '',
    currentUserName: auth.currentUserName,
  };
}
