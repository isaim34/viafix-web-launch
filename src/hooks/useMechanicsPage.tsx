
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mechanicsData } from '@/data/mechanicsPageData';
import { useZipcode } from '@/hooks/useZipcode';
import { toast } from '@/components/ui/use-toast';
import { BasicProfileFormValues } from '@/schemas/profileSchema';

export const useMechanicsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialZipCode = queryParams.get('zipCode') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [locationName, setLocationName] = useState('');
  const [localMechanicProfile, setLocalMechanicProfile] = useState<BasicProfileFormValues | null>(null);
  const { fetchLocationData, locationData, error, reset } = useZipcode();
  
  // Create a wrapped setZipCode function that handles side effects
  const handleSetZipCode = useCallback((newZipCode: string) => {
    setZipCode(newZipCode);
    
    // If zip code is being cleared, make sure we reset related state
    if (!newZipCode) {
      setLocationName('');
      reset();
    }
  }, [reset]);
  
  // Load local mechanic profile only if the user is a mechanic
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    
    // Only load mechanic profile if the user is actually a mechanic
    if (userRole === 'mechanic') {
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
    } else {
      // Ensure local mechanic profile is null for non-mechanics
      setLocalMechanicProfile(null);
    }
  }, []);
  
  // Fetch location data when zip code changes
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      fetchLocationData(zipCode);
    } else if (zipCode.length === 0) {
      setLocationName('');
      reset(); // Reset location data when zip code is cleared
    }
  }, [zipCode, fetchLocationData, reset]);
  
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
  
  // Add the local mechanic profile to the list if it exists AND the user is a mechanic
  const userRole = localStorage.getItem('userRole');
  
  if (localMechanicProfile && localMechanicProfile.firstName && localMechanicProfile.lastName && userRole === 'mechanic') {
    const localUserName = localStorage.getItem('userName');
    const userAvatar = localStorage.getItem('mechanicAvatar') || localStorage.getItem('mechanic-avatar');
    
    // Check if the mechanic is already in the list to avoid duplicates
    const existingMechanicIndex = combinedMechanics.findIndex(m => 
      m.name === `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}`
    );
    
    // Convert specialties string to array if it's a string
    const specialtiesArray = typeof localMechanicProfile.specialties === 'string' 
      ? localMechanicProfile.specialties.split(',').map(s => s.trim())
      : localMechanicProfile.specialties || [];
    
    const localMechanic = {
      id: 'local-mechanic',
      name: localUserName || `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}`,
      avatar: userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      specialties: specialtiesArray,
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
      // For the demo zip code, show all mechanics with 01605 zip code
      // including our local mechanic profile and test profiles
      return matchesSearch && mechanic.zipCode === '01605';
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
    setZipCode: handleSetZipCode,
    searchTerm,
    setSearchTerm,
    filteredMechanics,
    locationName,
    error
  };
};
