
import { useMemo } from 'react';
import { mechanicsData } from '@/data/mechanicsPageData';
import { BasicProfileFormValues } from '@/schemas/profileSchema';

interface Mechanic {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  zipCode?: string;
  galleryImages?: string[];
}

export const useFilteredMechanics = (
  searchTerm: string,
  zipCode: string,
  locationName: string,
  localMechanicProfile: BasicProfileFormValues | null
) => {
  return useMemo(() => {
    // Start with all mechanics from the data
    const allMechanics = [...mechanicsData];
    const userRole = localStorage.getItem('userRole');
    
    // Add local mechanic profile if it exists
    if (localMechanicProfile && localMechanicProfile.firstName && 
        localMechanicProfile.lastName && userRole === 'mechanic') {
      
      const localUserName = localStorage.getItem('userName');
      const userAvatar = localStorage.getItem('mechanicAvatar') || localStorage.getItem('mechanic-avatar');
      
      console.log('Local mechanic profile details:');
      console.log('- Profile data:', localMechanicProfile);
      console.log('- User role:', userRole);
      console.log('- Username:', localUserName);
      console.log('- Profile zip code:', localMechanicProfile.zipCode);
      console.log('- Search zip code:', zipCode);
      
      const existingMechanicIndex = allMechanics.findIndex(m => 
        m.name === `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}` || 
        m.id === 'local-mechanic'
      );
      
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
        allMechanics[existingMechanicIndex] = localMechanic;
      } else {
        allMechanics.push(localMechanic);
      }
    }
    
    // Ensure the mechanic profile with ID "local-mechanic" from mechanicsData is always included
    // This ensures that a vendor account is always searchable when a customer is looking for it
    const localMechanicInData = mechanicsData.find(m => m.id === 'local-mechanic');
    if (localMechanicInData && !allMechanics.some(m => m.id === 'local-mechanic')) {
      allMechanics.push(localMechanicInData);
    }
    
    // Filter mechanics
    const filteredMechanics = allMechanics.filter(mechanic => {
      console.log(`Filtering mechanic: ${mechanic.name}, id: ${mechanic.id}, zipCode: ${mechanic.zipCode}`);
      
      const matchesSearch = !searchTerm ? true : (
        mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mechanic.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        mechanic.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Special case for the local mechanic when logged in as a customer
      // Always include it in search results regardless of zip code
      if (userRole === 'customer' && mechanic.id === 'local-mechanic') {
        console.log('Customer searching for local mechanic, including it regardless of zip');
        return matchesSearch;
      }
      
      // If no zipcode filter, return based on search term only
      if (!zipCode) return matchesSearch;
      
      // Special handling for local mechanic
      if (mechanic.id === 'local-mechanic') {
        const zipCodeMatches = mechanic.zipCode === zipCode;
        console.log(`Local mechanic zip match? ${zipCodeMatches} (${mechanic.zipCode} === ${zipCode})`);
        // For local mechanic, be more lenient with zip code matching
        if (zipCodeMatches) return matchesSearch;
        // When user is searching specifically for this mechanic, include it
        if (searchTerm && mechanic.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      }
      
      if (zipCode === '01605') {
        const zipCodeMatches = mechanic.zipCode === '01605';
        const result = matchesSearch && zipCodeMatches;
        console.log(`Mechanic ${mechanic.name} included in 01605 results: ${result}`);
        return result;
      }
      
      if (locationName) {
        const cityName = locationName.split(',')[0].toLowerCase().trim();
        const mechanicCity = mechanic.location.toLowerCase();
        const isInSameCity = mechanicCity.includes(cityName);
        const hasMatchingZip = mechanic.zipCode === zipCode;
        
        return matchesSearch && (isInSameCity || hasMatchingZip);
      }
      
      return matchesSearch && mechanic.zipCode === zipCode;
    });
    
    // Special case for 01605
    if (zipCode === '01605' && userRole === 'mechanic' && 
        localMechanicProfile && localMechanicProfile.zipCode === '01605' && 
        !filteredMechanics.some(m => m.id === 'local-mechanic')) {
      
      console.log('SPECIAL CASE: Forcing inclusion of local mechanic for 01605 search');
      
      const specialtiesArray = typeof localMechanicProfile.specialties === 'string'
        ? localMechanicProfile.specialties.split(',').map(s => s.trim())
        : localMechanicProfile.specialties || [];
      
      const localUserName = localStorage.getItem('userName');
      const userAvatar = localStorage.getItem('mechanicAvatar') || localStorage.getItem('mechanic-avatar');
      
      const forcedLocalMechanic = {
        id: 'local-mechanic',
        name: localUserName || `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}`,
        avatar: userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
        specialties: specialtiesArray,
        rating: 5.0,
        reviewCount: 0,
        location: 'Worcester, MA',
        hourlyRate: localMechanicProfile.hourlyRate || 75,
        zipCode: '01605'
      };
      
      filteredMechanics.push(forcedLocalMechanic);
    }
    
    console.log('Final filtered mechanics:', filteredMechanics);
    return filteredMechanics;
  }, [searchTerm, zipCode, locationName, localMechanicProfile]);
};
