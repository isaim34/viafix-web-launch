
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useZipcode } from '@/hooks/useZipcode';
import { useLocalMechanicProfile } from '@/hooks/useLocalMechanicProfile';
import { useMechanicProfileSync } from '@/hooks/useMechanicProfileSync';
import { useMechanics } from '@/hooks/useMechanics';
import { useDisplayedMechanics } from '@/components/mechanics/useDisplayedMechanics';
import { useAuth } from '@/hooks/useAuth';

export const useMechanicsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialZipCode = queryParams.get('zipCode') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [locationName, setLocationName] = useState('');
  const { fetchLocationData, locationData, error, reset } = useZipcode();
  
  // Get auth context
  const auth = useAuth();
  const { currentUserRole } = auth;
  
  // Get the local mechanic profile
  const { localMechanicProfile } = useLocalMechanicProfile();
  
  // Sync mechanic profile data across the app
  useMechanicProfileSync();
  
  // Fetch mechanics from the database
  const { mechanics, loading: loadingMechanics } = useMechanics();
  
  // Get filtered mechanics
  const filteredMechanics = useDisplayedMechanics(
    mechanics,
    zipCode,
    currentUserRole
  );
  
  // Create a wrapped setZipCode function that handles side effects
  const handleSetZipCode = useCallback((newZipCode: string) => {
    setZipCode(newZipCode);
    
    if (!newZipCode) {
      setLocationName('');
      reset();
      // Clear manual flag when zip is explicitly cleared
      sessionStorage.removeItem('zipCodeManuallyCleared');
    } else {
      // Set flag to indicate user has set a zip code
      sessionStorage.removeItem('zipCodeManuallyCleared');
    }
  }, [reset]);
  
  // Update location name when we get data from the API
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      fetchLocationData(zipCode);
    } else if (zipCode.length === 0) {
      setLocationName('');
      reset();
    }
  }, [zipCode, fetchLocationData, reset]);
  
  useEffect(() => {
    if (locationData && locationData.places && locationData.places.length > 0) {
      const place = locationData.places[0];
      setLocationName(`${place.placeName}, ${place.stateAbbreviation}`);
    } else if (zipCode.length === 5 && !locationData) {
      if (zipCode === '01605') {
        setLocationName('Worcester, MA');
      }
    }
  }, [locationData, zipCode]);

  return {
    zipCode,
    setZipCode: handleSetZipCode,
    searchTerm,
    setSearchTerm,
    filteredMechanics,
    locationName,
    error,
    loading: loadingMechanics
  };
};
