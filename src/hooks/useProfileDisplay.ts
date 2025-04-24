
import { useAuth } from './useAuth';

export const useProfileDisplay = () => {
  const { getFirstName } = useAuth();

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
    const userEmail = localStorage.getItem('userEmail');
    let displayName = '';

    // First check for mechanic-specific name
    if (userRole === 'mechanic') {
      const vendorName = localStorage.getItem('vendorName');
      if (vendorName) {
        displayName = vendorName.split(' ')[0];
      }
    }

    // If no vendor name found, check other sources
    if (!displayName) {
      const fullName = localStorage.getItem('userName') || '';
      if (fullName.includes('@') && userEmail) {
        const registeredName = localStorage.getItem(`registered_${userEmail}`);
        if (registeredName) {
          displayName = registeredName.split(' ')[0];
        } else {
          displayName = getFirstName(fullName);
        }
      } else if (fullName) {
        displayName = getFirstName(fullName);
      }
    }

    // Check profile data as last resort
    if (!displayName && userRole) {
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
    }

    // Fallback to role-based default
    if (!displayName && userRole) {
      displayName = userRole === 'mechanic' ? 'Mechanic' : 'Customer';
    }

    return displayName;
  };

  return { getProfileImage, getDisplayName };
};
