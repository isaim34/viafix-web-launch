
import React from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { useToast } from '@/hooks/use-toast';

const ProfileEditor = () => {
  const { toast } = useToast();
  
  const onSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    // In a real app, this would save to a database
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  return (
    <div className="space-y-8">
      <ProfileTabs onProfileSubmit={onSubmit} />
    </div>
  );
};

export default ProfileEditor;
