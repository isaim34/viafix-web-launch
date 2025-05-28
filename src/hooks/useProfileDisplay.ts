
import { useAuth } from '@/hooks/useAuth';

export const useProfileDisplay = () => {
  const auth = useAuth();

  const getProfileImage = (): string => {
    // For now, return empty string - profile images will be handled via Supabase storage
    return '';
  };

  const getDisplayName = (): string => {
    if (auth.currentUserName) {
      return auth.currentUserName.split(' ')[0];
    }
    
    if (auth.user?.email) {
      return auth.user.email.split('@')[0];
    }
    
    return auth.currentUserRole === 'mechanic' ? 'Mechanic' : 'Customer';
  };

  return { 
    getProfileImage, 
    getDisplayName,
    getFirstName: auth.getFirstName 
  };
};
