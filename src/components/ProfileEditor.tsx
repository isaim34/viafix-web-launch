
import React from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { submitProfileData } from '@/utils/profileSubmission';
import { ProfileLoadingState } from './profile/ProfileLoadingState';
import { ProfileErrorState } from './profile/ProfileErrorState';

const ProfileEditor = () => {
  const { toast } = useToast();
  const auth = useAuth();
  const { profileData, setProfileData, isLoading, storageKey } = useProfileData();
  
  const onSubmit = async (data: BasicProfileFormValues) => {
    await submitProfileData(
      data, 
      storageKey, 
      auth, 
      profileData, 
      setProfileData, 
      toast
    );
  };

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  return (
    <div className="space-y-8">
      {profileData ? (
        <ProfileTabs onProfileSubmit={onSubmit} initialProfileData={profileData} />
      ) : (
        <ProfileErrorState />
      )}
    </div>
  );
};

export default ProfileEditor;
