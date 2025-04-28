
import { useAuth } from './useAuth';

export const useProfileDisplay = () => {
  const auth = useAuth();

  const getProfileImage = (): string => {
    try {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'customer') {
        const userId = localStorage.getItem('userId');
        return localStorage.getItem(`customer-${userId}-profileImage`) || '';
      } else if (userRole === 'mechanic') {
        return (
          localStorage.getItem('mechanicAvatar') || 
          localStorage.getItem('mechanic-avatar') || 
          localStorage.getItem('vendorAvatar') || 
          ''
        );
      }
      return '';
    } catch (error) {
      console.error('Error accessing profile image:', error);
      return '';
    }
  };

  const getDisplayName = (): string => {
    const userRole = localStorage.getItem('userRole');
    let displayName = '';

    // First try to get name from profile
    try {
      const profileKey = userRole === 'mechanic' ? 'mechanicProfile' : 'customerProfile';
      const profileData = localStorage.getItem(profileKey);
      if (profileData) {
        const profile = JSON.parse(profileData);
        if (profile.firstName) {
          displayName = profile.firstName;
        }
      }
    } catch (e) {
      console.error('Error getting name from profile:', e);
    }

    // If no name found in profile, try the registered name
    if (!displayName) {
      const fullName = localStorage.getItem('userName');
      if (fullName && !fullName.includes('@')) {
        displayName = fullName.split(' ')[0];
      }
    }

    // Fallback to role-based default if no name found
    if (!displayName && userRole) {
      displayName = userRole === 'mechanic' ? 'Mechanic' : 'Customer';
    }

    return displayName;
  };

  return { 
    getProfileImage, 
    getDisplayName,
    // Safely access getFirstName from auth
    getFirstName: auth.getFirstName 
  };
};
