
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
    console.log('useFilteredMechanics running with:', { searchTerm, zipCode, locationName });
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
    
    // ALWAYS include the default vendor mechanic for all searches
    // Find if there's already a mechanic with id 'local-mechanic' in our list
    const hasLocalMechanic = allMechanics.some(m => m.id === 'local-mechanic');
    
    // If not, add a default one that will always show up for customer searches
    if (!hasLocalMechanic) {
      console.log('Adding default vendor mechanic to results');
      const defaultVendorMechanic = {
        id: 'local-mechanic',
        name: 'Isai Mercado',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
        specialties: ['General Repairs', 'Diagnostics', 'Oil Changes'],
        rating: 5.0,
        reviewCount: 12,
        location: 'Worcester, MA',
        hourlyRate: 75,
        zipCode: '01605'
      };
      allMechanics.push(defaultVendorMechanic);
    }
    
    // Filter mechanics
    let filteredMechanics = allMechanics.filter(mechanic => {
      console.log(`Filtering mechanic: ${mechanic.name}, id: ${mechanic.id}, zipCode: ${mechanic.zipCode}`);
      
      // Always include the local mechanic for customers regardless of search or zip
      if (userRole === 'customer' && mechanic.id === 'local-mechanic') {
        console.log('Including vendor account for customer');
        return true;
      }
      
      const matchesSearch = !searchTerm ? true : (
        mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mechanic.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        mechanic.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // If no zipcode filter, return based on search term only
      if (!zipCode) return matchesSearch;
      
      // Special handling for local mechanic
      if (mechanic.id === 'local-mechanic') {
        return true; // Always include local mechanic
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
    
    // Ensure the vendor account is at the top of the list for customers
    if (userRole === 'customer') {
      const vendorIndex = filteredMechanics.findIndex(m => m.id === 'local-mechanic');
      if (vendorIndex > 0) {
        const vendorAccount = filteredMechanics.splice(vendorIndex, 1)[0];
        filteredMechanics.unshift(vendorAccount);
      }
    }
    
    console.log('Final filtered mechanics:', filteredMechanics.map(m => m.name));
    return filteredMechanics;
  }, [searchTerm, zipCode, locationName, localMechanicProfile]);
};
