
import { useState, useEffect } from 'react';
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { toast } from '@/components/ui/use-toast';

export const useLocalMechanicProfile = () => {
  const [localMechanicProfile, setLocalMechanicProfile] = useState<BasicProfileFormValues | null>(null);
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    
    console.log('useLocalMechanicProfile - Checking user role:', userRole);
    
    if (userRole === 'mechanic') {
      const storedProfile = localStorage.getItem('mechanicProfile');
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          console.log('useLocalMechanicProfile - Loaded mechanic profile:', profile);
          setLocalMechanicProfile(profile);
        } catch (error) {
          console.error('Error parsing mechanic profile:', error);
        }
      }
    } else {
      setLocalMechanicProfile(null);
    }
  }, []);

  return { localMechanicProfile };
};
