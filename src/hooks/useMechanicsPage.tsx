
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isStableLoading, setIsStableLoading] = useState(!!initialZipCode);
  const debounceTimerRef = useRef<number | null>(null);
  const { fetchLocationData, locationData, isLoading, error } = useZipcode();
  
  // Clear any existing debounce timer when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Use a debounce effect for zipcode to prevent too many API calls while typing
  useEffect(() => {
    // Clear any existing timer first
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Only proceed with zipcode lookup when we have exactly 5 digits
    if (zipCode.length === 5) {
      // Set loading immediately for better UX
      setIsStableLoading(true);
      
      // Debounce the API call
      debounceTimerRef.current = window.setTimeout(() => {
        setDebouncedZipCode(zipCode);
        debounceTimerRef.current = null;
      }, 600);
    } else if (zipCode.length === 0) {
      // If zip code is cleared, clear location name too
      setLocationName('');
      setIsStableLoading(false);
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
      
      // End loading with a slight delay for smooth transition
      const timer = window.setTimeout(() => {
        setIsStableLoading(false);
      }, 400);
      
      return () => clearTimeout(timer);
    } else if (!isLoading && debouncedZipCode) {
      // If API call completed but no data returned
      setLocationName('');
      
      // End loading with a slight delay for smooth transition
      const timer = window.setTimeout(() => {
        setIsStableLoading(false);
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [locationData, isLoading, debouncedZipCode]);
  
  // Ensure loading state ends if there's an error
  useEffect(() => {
    if (error) {
      const timer = window.setTimeout(() => {
        setIsStableLoading(false);
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [error]);
  
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
