
import React from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues } from '@/schemas/profileSchema';

const ProfileEditor = () => {
  const onSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    // In a real app, this would save to a database
  };

  return (
    <div className="space-y-8">
      <ProfileTabs onProfileSubmit={onSubmit} />
    </div>
  );
};

export default ProfileEditor;
