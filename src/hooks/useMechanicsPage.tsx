
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mechanicsData } from '@/data/mechanicsPageData';
import { useZipcode } from '@/hooks/useZipcode';
import { toast } from '@/components/ui/use-toast';
import { BasicProfileFormValues } from '@/schemas/profileSchema';

export const useMechanicsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialZipCode = queryParams.get('zipCode') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [locationName, setLocationName] = useState('');
  const [localMechanicProfile, setLocalMechanicProfile] = useState<BasicProfileFormValues | null>(null);
  const { fetchLocationData, locationData, error } = useZipcode();
  
  // Load local mechanic profile
  useEffect(() => {
    const storedProfile = localStorage.getItem('mechanicProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        console.log('Loaded mechanic profile from localStorage:', profile);
        setLocalMechanicProfile(profile);
      } catch (error) {
        console.error('Error parsing mechanic profile:', error);
      }
    }
  }, []);
  
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
    } else if (zipCode.length === 5 && !locationData) {
      // For demo zip code 01605 (Worcester, MA), set a default location name
      if (zipCode === '01605') {
        setLocationName('Worcester, MA');
      } else {
        // For other zip codes with no location data found
        toast({
          title: "Location not found",
          description: `We couldn't find location information for zip code ${zipCode}`,
          variant: "destructive"
        });
      }
    }
  }, [locationData, zipCode]);

  // Create a combined list of mechanics with the local profile included
  const combinedMechanics = [...mechanicsData];
  
  // Add the local mechanic profile to the list if it exists
  if (localMechanicProfile && localMechanicProfile.firstName && localMechanicProfile.lastName) {
    const localUserName = localStorage.getItem('userName');
    const userAvatar = localStorage.getItem('mechanicAvatar') || localStorage.getItem('mechanic-avatar');
    
    // Check if the mechanic is already in the list to avoid duplicates
    const existingMechanicIndex = combinedMechanics.findIndex(m => 
      m.name === `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}`
    );
    
    const localMechanic = {
      id: 'local-mechanic',
      name: localUserName || `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}`,
      avatar: userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      specialties: localMechanicProfile.specialties || [],
      rating: 5.0,
      reviewCount: 0,
      location: locationName || 'Worcester, MA',
      hourlyRate: localMechanicProfile.hourlyRate || 75,
      zipCode: localMechanicProfile.zipCode || '01605'
    };
    
    if (existingMechanicIndex >= 0) {
      // Update the existing mechanic
      combinedMechanics[existingMechanicIndex] = localMechanic;
    } else {
      // Add the local mechanic to the list
      combinedMechanics.push(localMechanic);
    }
  }
  
  const filteredMechanics = combinedMechanics.filter(mechanic => {
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
    
    // Special handling for the demo zip code 01605 (Worcester, MA)
    if (zipCode === '01605') {
      // For the demo zip code, show all mechanics in the Worcester area
      // including our local mechanic profile (which should have this zip code)
      if (mechanic.id === 'local-mechanic') {
        return matchesSearch;
      }
      
      // Show some sample mechanics for demo purposes
      const mechanicIndex = combinedMechanics.indexOf(mechanic);
      return matchesSearch && mechanicIndex < 3;
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
    error
  };
};
