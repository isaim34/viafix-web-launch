
import { useMemo } from 'react';
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { MechanicProfile } from '@/hooks/useMechanics';

export const useFilteredMechanics = (
  searchTerm: string,
  zipCode: string,
  locationName: string,
  mechanics: MechanicProfile[],
  localMechanicProfile: BasicProfileFormValues | null
) => {
  return useMemo(() => {
    console.log('useFilteredMechanics running with:', { 
      searchTerm, 
      zipCode, 
      locationName,
      mechanicsCount: mechanics.length
    });
    
    // Start with all mechanics from the database
    const allMechanics = [...mechanics];
    const userRole = localStorage.getItem('userRole');
    
    // Get vendor information ensuring consistency
    const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
    const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
    
    // Always store these values for consistency
    localStorage.setItem('vendorName', vendorName);
    localStorage.setItem('vendorAvatar', vendorAvatar);
    
    // Only add mechanic's own profile to the list if they are logged in as a mechanic
    if (localMechanicProfile && localMechanicProfile.firstName && 
        localMechanicProfile.lastName && userRole === 'mechanic') {
      
      const localUserName = localStorage.getItem('userName');
      const userAvatar = localStorage.getItem('mechanicAvatar') || 
                         localStorage.getItem('mechanic-avatar') || 
                         localMechanicProfile.profileImage;
      
      console.log('Local mechanic profile details:');
      console.log('- Profile data:', localMechanicProfile);
      console.log('- User role:', userRole);
      console.log('- Username:', localUserName);
      console.log('- Profile zip code:', localMechanicProfile.zipCode);
      console.log('- Search zip code:', zipCode);
      
      // Check if the mechanic already exists in the list
      const existingMechanicIndex = allMechanics.findIndex(m => 
        m.name === `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}` || 
        m.id === 'local-mechanic'
      );
      
      // Get reviews for local mechanic from localStorage
      const localReviews = JSON.parse(localStorage.getItem('special_mechanic_reviews') || '[]');
      const mechanicReviews = localReviews.filter((review: any) => review.mechanic_id === 'local-mechanic');
      
      // Calculate actual rating and review count
      let rating = 5.0;
      const reviewCount = mechanicReviews.length;
      if (reviewCount > 0) {
        const totalRating = mechanicReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
        rating = totalRating / reviewCount;
      }
      
      const specialtiesArray = typeof localMechanicProfile.specialties === 'string'
        ? localMechanicProfile.specialties.split(',').map(s => s.trim())
        : localMechanicProfile.specialties || [];
      
      const localMechanic = {
        id: 'local-mechanic',
        name: localUserName || `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}`,
        avatar: userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
        specialties: specialtiesArray,
        rating: rating,
        reviewCount: reviewCount,
        location: locationName || 'Worcester, MA',
        hourlyRate: localMechanicProfile.hourlyRate || 75,
        zipCode: localMechanicProfile.zipCode || '01605'
      };
      
      if (existingMechanicIndex >= 0) {
        allMechanics[existingMechanicIndex] = localMechanic;
      } else {
        allMechanics.push(localMechanic);
      }
      
      // Store consistent vendor information
      localStorage.setItem('vendorName', localMechanic.name);
      localStorage.setItem('vendorAvatar', localMechanic.avatar);
    }
    
    // Add default vendor mechanic ONLY for viewing by customers, not when customers themselves are logged in
    if (allMechanics.length === 0 && userRole !== 'customer') {
      // For non-logged in users or mechanics with no data, add the vendor mechanic
      const hasLocalMechanic = allMechanics.some(m => m.id === 'local-mechanic');
      
      if (!hasLocalMechanic) {
        // Get reviews for default vendor from localStorage
        const localReviews = JSON.parse(localStorage.getItem('special_mechanic_reviews') || '[]');
        const vendorReviews = localReviews.filter((review: any) => review.mechanic_id === 'default-vendor');
        
        // Calculate actual rating
        let rating = 5.0;
        const reviewCount = vendorReviews.length;
        if (reviewCount > 0) {
          const totalRating = vendorReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
          rating = totalRating / reviewCount;
        }
        
        console.log('Adding default vendor mechanic to results with avatar:', vendorAvatar?.substring(0, 30) + '...');
        const defaultVendorMechanic = {
          id: 'local-mechanic',
          name: vendorName,
          avatar: vendorAvatar,
          specialties: ['General Repairs', 'Diagnostics', 'Oil Changes'],
          rating: rating,
          reviewCount: reviewCount,
          location: locationName || 'Worcester, MA',
          hourlyRate: 75,
          zipCode: zipCode || '01605' // Use customer's current zip code or default
        };
        allMechanics.push(defaultVendorMechanic);
      }
    }
    
    // Filter mechanics
    let filteredMechanics = allMechanics.filter(mechanic => {
      console.log(`Filtering mechanic: ${mechanic.name}, id: ${mechanic.id}, zipCode: ${mechanic.zipCode}`);
      
      // For logged-in customers, never include their own profile as a mechanic
      if (userRole === 'customer' && mechanic.id === 'local-mechanic') {
        console.log('Excluding customer\'s own account from mechanic results');
        return false;
      }
      
      // Check for search term matches
      let matchesSearch = !searchTerm;
      
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        // Check name - ensure mechanic.name exists and is a string
        if (mechanic.name && typeof mechanic.name === 'string' && mechanic.name.toLowerCase().includes(lowerSearchTerm)) {
          matchesSearch = true;
        }
        
        // Check specialties (handle both string and array types)
        else if (mechanic.specialties) {
          if (Array.isArray(mechanic.specialties)) {
            // Handle array of specialties - ensure proper typing
            const validSpecialties: string[] = mechanic.specialties.filter((specialty): specialty is string => 
              typeof specialty === 'string'
            );
            matchesSearch = validSpecialties.some(specialty => 
              specialty.toLowerCase().includes(lowerSearchTerm)
            );
          } else if (typeof mechanic.specialties === 'string') {
            // Handle string specialties
            matchesSearch = mechanic.specialties.toLowerCase().includes(lowerSearchTerm);
          }
        }
        
        // Check location - ensure mechanic.location exists and is a string
        else if (mechanic.location && typeof mechanic.location === 'string' && mechanic.location.toLowerCase().includes(lowerSearchTerm)) {
          matchesSearch = true;
        }
      }
      
      // If no zipcode filter, return based on search term only
      if (!zipCode) return matchesSearch;
      
      // Special case for Worcester, MA
      if (zipCode === '01605') {
        if (mechanic.id === 'local-mechanic' && userRole !== 'customer') return true;
        const zipCodeMatches = mechanic.zipCode === '01605';
        const result = matchesSearch && zipCodeMatches;
        console.log(`Mechanic ${mechanic.name} included in 01605 results: ${result}`);
        return result;
      }
      
      // For any other zip code, include mechanics in that area
      // Check if mechanic has zipCode property and it matches the requested zipCode
      if (mechanic.zipCode === zipCode) {
        return matchesSearch;
      }
      
      // Also check for city/location matches when we have a location name
      if (locationName && mechanic.location && typeof mechanic.location === 'string') {
        const cityName = locationName.split(',')[0].toLowerCase().trim();
        const mechanicCity = mechanic.location.toLowerCase();
        const isInSameCity = mechanicCity.includes(cityName);
        
        return matchesSearch && isInSameCity;
      }
      
      // Default behavior - must match both search and zipcode
      return matchesSearch && mechanic.zipCode === zipCode;
    });
    
    console.log('Final filtered mechanics:', filteredMechanics.map(m => m.name));
    return filteredMechanics;
  }, [searchTerm, zipCode, locationName, mechanics, localMechanicProfile]);
};
