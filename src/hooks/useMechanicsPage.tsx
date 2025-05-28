
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useZipcode } from '@/hooks/useZipcode';
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
  
  // Fetch mechanics from the database (real data only)
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
      sessionStorage.removeItem('zipCodeManuallyCleared');
    } else {
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
