
import React from 'react';
import { useMechanicProfilePage } from '@/hooks/useMechanicProfilePage';
import { MechanicProfileLoading } from '@/components/mechanic/MechanicProfileLoading';
import { MechanicProfileNotFound } from '@/components/mechanic/MechanicProfileNotFound';
import { MechanicProfileContent } from '@/components/mechanic/MechanicProfileContent';

const MechanicProfile = () => {
  const profileData = useMechanicProfilePage();
  const { loading, mechanic } = profileData;
  
  // If loading, show a loading indicator
  if (loading) {
    return <MechanicProfileLoading />;
  }
  
  // Check if mechanic data is available
  if (!mechanic) {
    return <MechanicProfileNotFound />;
  }

  // Render the main content when mechanic is loaded
  return <MechanicProfileContent profileData={profileData} />;
};

export default MechanicProfile;
