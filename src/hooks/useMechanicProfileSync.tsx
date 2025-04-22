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
    const userEmail = localStorage.getItem('userEmail');
    
    if (userRole === 'mechanic') {
      // For mechanics, ensure their profile data is synchronized
      syncMechanicProfileData();
    } else if (userRole === 'customer') {
      // For customers, ensure vendor data is available
      ensureVendorData();
      syncCustomerProfileData(userEmail); // Add customer profile sync with email
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
    const userEmail = localStorage.getItem('userEmail');
    
    if (userRole === 'mechanic') {
      syncMechanicProfileData();
    } else if (userRole === 'customer') {
      ensureVendorData();
      syncCustomerProfileData(userEmail); // Add customer profile sync with email
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
  
  const syncCustomerProfileData = (userEmail?: string | null) => {
    try {
      const profileData = localStorage.getItem('customerProfile');
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
      
      // If we have email and updated profile data, save it for persistence
      if (userEmail && profileData) {
        localStorage.setItem(`customer_profile_${userEmail}`, profileData);
      }
      
      // If customer profile exists in localStorage, use it
      if (profileData) {
        const profile = JSON.parse(profileData);
        
        // Ensure customer avatar is consistent
        const avatarSources = [
          localStorage.getItem('customerAvatar'),
          localStorage.getItem('customer-avatar'),
          profile.profileImage
        ].filter(Boolean);
        
        if (avatarSources.length > 0) {
          const primaryAvatar = avatarSources[0];
          
          // Set avatar in all storage locations
          localStorage.setItem('customerAvatar', primaryAvatar);
          localStorage.setItem('customer-avatar', primaryAvatar);
          
          // Update profile image
          if (profile.profileImage !== primaryAvatar) {
            profile.profileImage = primaryAvatar;
            localStorage.setItem('customerProfile', JSON.stringify(profile));
            
            // Also update email-keyed storage
            if (userEmail) {
              localStorage.setItem(`customer_profile_${userEmail}`, JSON.stringify(profile));
            }
          }
          
          // Store with user-specific key
          if (userId) {
            localStorage.setItem(`customer-${userId}-profileImage`, primaryAvatar);
          }
        }
        
        // Ensure customer name is consistent
        if (userName && (userName !== `${profile.firstName} ${profile.lastName}`.trim())) {
          // Split userName into first and last name
          const nameParts = userName.split(' ');
          profile.firstName = nameParts[0] || '';
          profile.lastName = nameParts.slice(1).join(' ') || '';
          localStorage.setItem('customerProfile', JSON.stringify(profile));
          
          // Also update email-keyed storage
          if (userEmail) {
            localStorage.setItem(`customer_profile_${userEmail}`, JSON.stringify(profile));
          }
        } else if (profile.firstName && !userName) {
          const fullName = `${profile.firstName} ${profile.lastName}`.trim();
          if (fullName) {
            localStorage.setItem('userName', fullName);
          }
        }
      } else if (userName) {
        // If no profile exists but we have userName, create a basic profile
        const nameParts = userName.split(' ');
        const basicProfile = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          profileImage: localStorage.getItem('customerAvatar') || ''
        };
        localStorage.setItem('customerProfile', JSON.stringify(basicProfile));
        
        // Also save to email-keyed storage
        if (userEmail) {
          localStorage.setItem(`customer_profile_${userEmail}`, JSON.stringify(basicProfile));
        }
      }
    } catch (error) {
      console.error('Error syncing customer profile data:', error);
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
