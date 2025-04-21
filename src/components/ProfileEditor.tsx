
import React, { useEffect, useState } from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues, sampleMechanicProfile } from '@/schemas/profileSchema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ProfileEditor = () => {
  const { toast } = useToast();
  const { currentUserRole, updateUserName, currentUserName } = useAuth();
  const [profileData, setProfileData] = useState<BasicProfileFormValues | null>(null);
  const storageKey = currentUserRole === 'mechanic' ? 'mechanicProfile' : 'customerProfile';

  // Load profile data from localStorage on component mount
  useEffect(() => {
    // Try to load saved profile data first
    const savedProfileData = localStorage.getItem(storageKey);
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        console.log('Loading saved profile data:', parsedData);
        
        // Ensure firstName and lastName are strings
        if (parsedData.firstName === undefined) parsedData.firstName = '';
        if (parsedData.lastName === undefined) parsedData.lastName = '';
        
        setProfileData(parsedData);
      } catch (error) {
        console.error('Error parsing profile data from localStorage:', error);
      }
    } else {
      // If no saved profile data exists, create a new profile using the current username
      const nameParts = currentUserName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create a new profile based on the template but with current username
      const initialProfile = {
        ...sampleMechanicProfile,
        firstName,
        lastName,
      };
      
      setProfileData(initialProfile);
      console.log('Created new profile with current username:', initialProfile);
    }
  }, [storageKey, updateUserName, currentUserName]);
  
  const onSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    console.log('Profile image in submission:', data.profileImage?.substring(0, 50) + '...');
    
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
      console.log('Avatar saved to localStorage with keys:', avatarKey, legacyAvatarKey);
    }
    
    // Update username in localStorage if name has changed
    if (data.firstName !== undefined && data.lastName !== undefined) {
      const fullName = `${data.firstName} ${data.lastName}`;
      
      // Use the updateUserName function from useAuth to ensure proper updates
      updateUserName(fullName);
      
      console.log('Updated userName in localStorage to:', fullName);
    }
    
    // Update state after saving
    setProfileData({...data});
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated and saved",
    });
  };

  return (
    <div className="space-y-8">
      {profileData && <ProfileTabs onProfileSubmit={onSubmit} initialProfileData={profileData} />}
    </div>
  );
};

export default ProfileEditor;
