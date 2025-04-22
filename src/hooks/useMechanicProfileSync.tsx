
import { useEffect } from 'react';

/**
 * Hook to synchronize mechanic profile data across different parts of the application
 * Ensures name and avatar are consistently available for the vendor account
 */
export const useMechanicProfileSync = () => {
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
  }, []);
  
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
          localStorage.setItem('mechanicAvatar', primaryAvatar);
          localStorage.setItem('mechanic-avatar', primaryAvatar);
          
          // Also save as vendor data for consistent display
          localStorage.setItem('vendorAvatar', primaryAvatar);
        }
        
        // Ensure mechanic name is consistent
        if (userName) {
          localStorage.setItem('vendorName', userName);
        } else if (profile.firstName && profile.lastName) {
          const fullName = `${profile.firstName} ${profile.lastName}`.trim();
          localStorage.setItem('userName', fullName);
          localStorage.setItem('vendorName', fullName);
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
  };
  
  return null;
};
