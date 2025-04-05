
import React, { useEffect, useState } from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues, sampleMechanicProfile } from '@/schemas/profileSchema';
import { useToast } from '@/hooks/use-toast';

const ProfileEditor = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<BasicProfileFormValues>(sampleMechanicProfile);

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfileData = localStorage.getItem('mechanicProfile');
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        setProfileData(parsedData);
      } catch (error) {
        console.error('Error parsing profile data from localStorage:', error);
      }
    }
  }, []);
  
  const onSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    // Save to localStorage
    localStorage.setItem('mechanicProfile', JSON.stringify(data));
    setProfileData(data);
    
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
