
import { useState, useEffect, useCallback } from 'react';
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
  const [debouncedZipCode, setDebouncedZipCode] = useState(initialZipCode);
  const [isStableLoading, setIsStableLoading] = useState(false);
  const { fetchLocationData, locationData, isLoading, error } = useZipcode();
  
  // Use a debounce effect for zipcode to prevent too many API calls while typing
  useEffect(() => {
    // Only proceed with zipcode lookup when we have exactly 5 digits
    if (zipCode.length === 5) {
      const timer = setTimeout(() => {
        setDebouncedZipCode(zipCode);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [zipCode]);
  
  // Fetch location data when debouncedZipCode changes (not on every zipCode change)
  useEffect(() => {
    if (debouncedZipCode && debouncedZipCode.length === 5) {
      fetchLocationData(debouncedZipCode);
    }
  }, [debouncedZipCode, fetchLocationData]);
  
  // Update locationName when we get data from the API
  useEffect(() => {
    if (locationData && locationData.places && locationData.places.length > 0) {
      const place = locationData.places[0];
      setLocationName(`${place.placeName}, ${place.stateAbbreviation}`);
    } else {
      setLocationName('');
    }
  }, [locationData]);
  
  // Stabilized loading state with minimal transitions
  useEffect(() => {
    if (isLoading) {
      // Set loading immediately
      setIsStableLoading(true);
    } else {
      // When API call completes, set a small delay before finishing loading
      // to ensure animations complete smoothly
      const timer = setTimeout(() => {
        setIsStableLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
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
    isLoading: isStableLoading,
    error,
    debouncedZipCode
  };
};
