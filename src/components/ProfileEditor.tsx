
import React, { useEffect, useState } from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues, sampleMechanicProfile } from '@/schemas/profileSchema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProfileEditor = () => {
  const { toast } = useToast();
  const { currentUserRole, updateUserName, currentUserName, getFirstName } = useAuth();
  const [profileData, setProfileData] = useState<BasicProfileFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const storageKey = currentUserRole === 'mechanic' ? 'mechanicProfile' : 'customerProfile';

  // Load profile data from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    
    // Try to load saved profile data first
    const savedProfileData = localStorage.getItem(storageKey);
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        console.log('Loading saved profile data:', parsedData);
        setProfileData(parsedData);
      } catch (error) {
        console.error('Error parsing profile data from localStorage:', error);
        setProfileData(createInitialProfile());
      }
    } else {
      setProfileData(createInitialProfile());
    }
    
    setIsLoading(false);
  }, [storageKey, currentUserName]);
  
  // Helper function to create initial profile
  const createInitialProfile = () => {
    // Handle email-based usernames properly
    let firstName = '';
    let lastName = '';
    
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
    
    const initialProfile = {
      ...sampleMechanicProfile,
      firstName,
      lastName,
    };
    
    console.log('Created new profile with current username:', initialProfile);
    return initialProfile;
  };
  
  const onSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    
    // Ensure we have the profile image in the data
    if (!data.profileImage && profileData?.profileImage) {
      data.profileImage = profileData.profileImage;
    }
    
    // Convert specialties to string format for consistency when saving
    if (Array.isArray(data.specialties)) {
      data.specialties = data.specialties.join(', ');
    }
    
    // Save to localStorage with user role-specific key
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    // Explicitly save avatar to localStorage - store both keys for compatibility
    if (data.profileImage) {
      const avatarKey = currentUserRole === 'mechanic' ? 'mechanicAvatar' : 'customerAvatar';
      const legacyAvatarKey = currentUserRole === 'mechanic' ? 'mechanic-avatar' : 'customer-avatar';
      
      localStorage.setItem(avatarKey, data.profileImage);
      localStorage.setItem(legacyAvatarKey, data.profileImage);
      
      // Also save to the userId-specific key
      const userId = localStorage.getItem('userId');
      if (userId) {
        localStorage.setItem(`${currentUserRole === 'mechanic' ? 'mechanic' : 'customer'}-${userId}-profileImage`, data.profileImage);
      }
      
      console.log('Avatar saved to localStorage with keys:', avatarKey, legacyAvatarKey);
    }
    
    // Update username in localStorage if name has changed
    if (data.firstName !== undefined && data.lastName !== undefined) {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      if (fullName) {
        // Use the updateUserName function from useAuth to ensure proper updates
        updateUserName(fullName);
        console.log('Updated userName in localStorage to:', fullName);
        
        // Force refresh for mechanic dashboard header
        window.dispatchEvent(new Event('storage-event'));
      }
    }
    
    // Update state after saving
    setProfileData({...data});
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated and saved",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {profileData ? (
        <ProfileTabs onProfileSubmit={onSubmit} initialProfileData={profileData} />
      ) : (
        <div className="p-6 bg-gray-100 rounded-md text-center">
          <p>Failed to load profile data. Please refresh the page and try again.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;
