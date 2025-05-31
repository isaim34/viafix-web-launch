
import { useState, useEffect } from 'react';
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { useAuth } from '@/hooks/useAuth';
import { handleAsyncError } from '@/utils/errorHandler';

export const useProfileData = () => {
  const { currentUserRole, currentUserName } = useAuth();
  const [profileData, setProfileData] = useState<BasicProfileFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storageKey = currentUserRole === 'mechanic' ? 'mechanicProfile' : 'customerProfile';

  // Helper function to create initial profile
  const createInitialProfile = () => {
    try {
      // Handle email-based usernames properly
      let firstName = '';
      let lastName = '';
      
      if (currentUserName) {
        if (currentUserName.includes('@')) {
          // If username is an email, use the part before @ as first name
          firstName = currentUserName.split('@')[0];
          // Capitalize first letter
          firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        } else {
          // Normal name handling
          const nameParts = currentUserName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
      }
      
      const initialProfile = {
        firstName,
        lastName,
        phone: '',
        zipCode: '',
        about: '',
        specialties: '',
        yearsExperience: 0,
        hourlyRate: 0,
        profileImage: '',
      };
      
      console.log('Created new profile with current username:', initialProfile);
      return initialProfile;
    } catch (err) {
      console.error('Error creating initial profile:', err);
      handleAsyncError(err, 'Creating initial profile');
      return {
        firstName: '',
        lastName: '',
        phone: '',
        zipCode: '',
        about: '',
        specialties: '',
        yearsExperience: 0,
        hourlyRate: 0,
        profileImage: '',
      };
    }
  };

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to load saved profile data first
        const savedProfileData = localStorage.getItem(storageKey);
        if (savedProfileData) {
          try {
            const parsedData = JSON.parse(savedProfileData);
            console.log('Loading saved profile data:', parsedData);
            setProfileData(parsedData);
          } catch (parseError) {
            console.error('Error parsing profile data from localStorage:', parseError);
            setError('Failed to load saved profile data');
            setProfileData(createInitialProfile());
          }
        } else {
          setProfileData(createInitialProfile());
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data');
        handleAsyncError(err, 'Loading profile data');
        setProfileData(createInitialProfile());
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [storageKey, currentUserName, currentUserRole]);

  return {
    profileData,
    setProfileData,
    isLoading,
    error,
    storageKey
  };
};
