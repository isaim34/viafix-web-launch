
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mechanicsData } from '@/data/mechanicsPageData';
import { useZipcode } from '@/hooks/useZipcode';
import { toast } from '@/components/ui/use-toast';

export const useMechanicsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialZipCode = queryParams.get('zipCode') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [locationName, setLocationName] = useState('');
  const { fetchLocationData, locationData, isLoading, error } = useZipcode();
  
  // Fetch location data when zip code changes
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      fetchLocationData(zipCode);
    } else if (zipCode.length === 0) {
      setLocationName('');
    }
  }, [zipCode, fetchLocationData]);
  
  // Update locationName when we get data from the API
  useEffect(() => {
    if (locationData && locationData.places && locationData.places.length > 0) {
      const place = locationData.places[0];
      setLocationName(`${place.placeName}, ${place.stateAbbreviation}`);
    } else if (zipCode.length === 5 && !isLoading && !locationData) {
      // If no location data found for valid zip code
      toast({
        title: "Location not found",
        description: `We couldn't find location information for zip code ${zipCode}`,
        variant: "destructive"
      });
    }
  }, [locationData, zipCode, isLoading]);
  
  const filteredMechanics = mechanicsData.filter(mechanic => {
    // Search term filtering (name, specialties, location)
    const matchesSearch = !searchTerm ? true : (
      mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mechanic.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // If no zip code is provided, show all mechanics that match the search term
    if (!zipCode) {
      return matchesSearch;
    }
    
    // More flexible location matching when zip code is provided
    if (locationName) {
      // Extract city name from location data
      const cityName = locationName.split(',')[0].toLowerCase().trim();
      
      // Check if mechanic's location contains the city name
      const mechanicCity = mechanic.location.toLowerCase();
      const isInSameCity = mechanicCity.includes(cityName);
      
      // Also consider exact zip code matches
      const hasMatchingZip = mechanic.zipCode === zipCode;
      
      return matchesSearch && (isInSameCity || hasMatchingZip);
    }
    
    // Fallback to exact zip code matching if we don't have location data yet
    return matchesSearch && mechanic.zipCode === zipCode;
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
