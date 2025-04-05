
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mechanicsData } from '@/data/mechanicsPageData';
import { useZipcode } from '@/hooks/useZipcode';

export const useMechanicsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialZipCode = queryParams.get('zipCode') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [locationName, setLocationName] = useState('');
  const { fetchLocationData, locationData, isLoading, error } = useZipcode();
  
  // Fetch location data when zipCode changes
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      fetchLocationData(zipCode);
    }
  }, [zipCode, fetchLocationData]);
  
  // Update locationName when we get data from the API
  useEffect(() => {
    if (locationData && locationData.places && locationData.places.length > 0) {
      const place = locationData.places[0];
      setLocationName(`${place.placeName}, ${place.stateAbbreviation}`);
    } else {
      setLocationName('');
    }
  }, [locationData]);
  
  const filteredMechanics = mechanicsData.filter(mechanic => {
    const matchesSearch = 
      mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mechanic.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Enhanced zipcode matching logic
    const matchesZip = !zipCode ? true : (
      // Exact match with mechanic's zipcode if available
      (mechanic.zipCode && mechanic.zipCode === zipCode) ||
      // Or in same city/area if we have location data
      (locationName && mechanic.location.includes(locationName.split(',')[0]))
    );
    
    return matchesSearch && matchesZip;
  });

  return {
    zipCode,
    setZipCode,
    searchTerm,
    setSearchTerm,
    filteredMechanics,
    locationName,
    isLoading,
    error
  };
};
