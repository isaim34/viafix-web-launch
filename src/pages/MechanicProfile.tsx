
import React from 'react';
import { useMechanicProfilePage } from '@/hooks/useMechanicProfilePage';
import { MechanicProfileLoading } from '@/components/mechanic/MechanicProfileLoading';
import { MechanicProfileNotFound } from '@/components/mechanic/MechanicProfileNotFound';
import { MechanicProfileContent } from '@/components/mechanic/MechanicProfileContent';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/use-mobile';

const MechanicProfile = () => {
  const profileData = useMechanicProfilePage();
  const { loading, mechanic } = profileData;
  const isMobile = useIsMobile();
  
  // If loading, show a loading indicator
  if (loading) {
    return <MechanicProfileLoading />;
  }
  
  // Check if mechanic data is available
  if (!mechanic) {
    return <MechanicProfileNotFound />;
  }

  // Add responsive meta tag for this page
  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <MechanicProfileContent profileData={profileData} />
    </>
  );
};

export default MechanicProfile;
