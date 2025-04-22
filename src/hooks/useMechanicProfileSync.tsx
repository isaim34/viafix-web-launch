
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to synchronize mechanic profile data across different parts of the application
 * Ensures name and avatar are consistently available for the vendor account
 */
export const useMechanicProfileSync = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Get user role to determine what data to sync
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'mechanic') {
      // For mechanics, ensure their profile data is synchronized
      syncMechanicProfileData();
    } else if (userRole === 'customer') {
      // For customers, ensure vendor data is available
      ensureVendorData();
    }
    
    // Add event listener for storage changes to ensure real-time updates
    window.addEventListener('storage-event', handleStorageEvent);
    
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('storage-event', handleStorageEvent);
    };
  }, []);
  
  const handleStorageEvent = () => {
    // Re-sync data when storage changes
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'mechanic') {
      syncMechanicProfileData();
    } else if (userRole === 'customer') {
      ensureVendorData();
    }
  };
  
  const syncMechanicProfileData = () => {
    try {
      // Get profile data
      const profileData = localStorage.getItem('mechanicProfile');
      const userName = localStorage.getItem('userName');
      
      if (profileData) {
        const profile = JSON.parse(profileData);
        
        // Ensure mechanic avatar is consistent
        const avatarSources = [
          localStorage.getItem('mechanicAvatar'),
          localStorage.getItem('mechanic-avatar'),
          profile.profileImage
        ].filter(Boolean);
        
        if (avatarSources.length > 0) {
          const primaryAvatar = avatarSources[0];
          
          // Set avatar in all storage locations
          localStorage.setItem('mechanicAvatar', primaryAvatar);
          localStorage.setItem('mechanic-avatar', primaryAvatar);
          localStorage.setItem('vendorAvatar', primaryAvatar);
          
          // Also update profile image in the stored profile if it differs
          if (profile.profileImage !== primaryAvatar) {
            profile.profileImage = primaryAvatar;
            localStorage.setItem('mechanicProfile', JSON.stringify(profile));
          }
          
          console.log('Synced mechanic avatar:', primaryAvatar.substring(0, 30) + '...');
        }
        
        // Ensure mechanic name is consistent
        if (userName) {
          localStorage.setItem('vendorName', userName);
        } else if (profile.firstName && profile.lastName) {
          const fullName = `${profile.firstName} ${profile.lastName}`.trim();
          localStorage.setItem('userName', fullName);
          localStorage.setItem('vendorName', fullName);
        }
        
        // If userId exists, store avatar with user-specific key
        const userId = localStorage.getItem('userId');
        if (userId && avatarSources.length > 0) {
          localStorage.setItem(`mechanic-${userId}-profileImage`, avatarSources[0]);
        }
      }
    } catch (error) {
      console.error('Error syncing mechanic profile data:', error);
    }
  };
  
  const ensureVendorData = () => {
    // For customers, ensure vendor data exists with defaults
    if (!localStorage.getItem('vendorName')) {
      localStorage.setItem('vendorName', 'Isai Mercado');
    }
    
    if (!localStorage.getItem('vendorAvatar')) {
      localStorage.setItem('vendorAvatar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80');
    }
    
    // Also ensure the vendor is in mechanic list results by storing in specific keys
    const vendorAvatar = localStorage.getItem('vendorAvatar');
    const vendorName = localStorage.getItem('vendorName');
    
    if (vendorAvatar) {
      localStorage.setItem('local-mechanic-avatar', vendorAvatar);
    }
    
    if (vendorName) {
      localStorage.setItem('local-mechanic-name', vendorName);
    }
  };
  
  return null;
};
