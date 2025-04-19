
import React, { useEffect, useState } from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues, sampleMechanicProfile } from '@/schemas/profileSchema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ProfileEditor = () => {
  const { toast } = useToast();
  const { currentUserRole, updateUserName } = useAuth();
  const [profileData, setProfileData] = useState<BasicProfileFormValues>(sampleMechanicProfile);
  const storageKey = currentUserRole === 'mechanic' ? 'mechanicProfile' : 'customerProfile';

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfileData = localStorage.getItem(storageKey);
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        console.log('Loading saved profile data:', parsedData);
        setProfileData(parsedData);
        
        // When profile data is loaded, ensure the header username is in sync
        if (parsedData.firstName && parsedData.lastName) {
          const fullName = `${parsedData.firstName} ${parsedData.lastName}`;
          updateUserName(fullName);
        }
      } catch (error) {
        console.error('Error parsing profile data from localStorage:', error);
      }
    }
  }, [storageKey, updateUserName]);
  
  const onSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    console.log('Profile image in submission:', data.profileImage?.substring(0, 50) + '...');
    
    // Ensure we have the profile image in the data
    if (!data.profileImage && profileData.profileImage) {
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
    if (data.firstName && data.lastName) {
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
      <ProfileTabs onProfileSubmit={onSubmit} initialProfileData={profileData} />
    </div>
  );
};

export default ProfileEditor;
