
import { useEffect } from 'react';
import { syncMechanicProfileData } from '@/utils/profileSync/mechanicProfileSync';
import { syncCustomerProfileData } from '@/utils/profileSync/customerProfileSync';

/**
 * Hook to manage mechanic profile synchronization across the application
 * This ensures profile data consistency between different storage locations
 */
export const useMechanicProfileSync = () => {
  useEffect(() => {
    // Initial sync on component mount
    syncMechanicProfileData();
    
    // Get the user email if available
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      syncCustomerProfileData(userEmail);
    }
    
    // Set up listener for storage events
    const handleStorageEvent = () => {
      syncMechanicProfileData();
      if (userEmail) {
        syncCustomerProfileData(userEmail);
      }
    };
    
    // Listen for custom storage event (triggered manually in ProfileEditor)
    window.addEventListener('storage-event', handleStorageEvent);
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('storage-event', handleStorageEvent);
    };
  }, []);
  
  return null;
};
