
import { useMemo } from 'react';
import { MechanicProfile } from '@/hooks/useMechanics';

// Returns filtered mechanics to display (already respecting currentUserRole, etc)
export function useDisplayedMechanics(
  mechanics: MechanicProfile[],
  zipCode: string,
  currentUserRole: string | null
) {
  return useMemo(() => {
    console.log('useDisplayedMechanics - Starting with params:', { 
      mechanicsCount: mechanics.length,
      zipCode,
      currentUserRole
    });
    
    // Start with the mechanics from the database
    let displayMechanics = [...mechanics];
    
    // Check if the local mechanic (vendor) exists in the mechanics list
    const hasLocalMechanic = displayMechanics.some(m => m.id === 'local-mechanic');
    console.log('Has local mechanic in initial list:', hasLocalMechanic);
    
    // Add the local mechanic if it's not already in the list (for mechanic users only)
    if (!hasLocalMechanic && currentUserRole === 'mechanic') {
      const mechanicProfile = localStorage.getItem('mechanicProfile');
      if (mechanicProfile) {
        try {
          const profile = JSON.parse(mechanicProfile);
          console.log('Found local mechanic profile:', profile);
          
          const vendorName = localStorage.getItem('vendorName') || 'Mike Rodriguez';
          const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
          
          // Get reviews for local mechanic from localStorage
          const localReviews = JSON.parse(localStorage.getItem('special_mechanic_reviews') || '[]');
          const mechanicReviews = localReviews.filter((review: any) => review.mechanic_id === 'local-mechanic');
          
          // Calculate actual rating
          let rating = 5.0;
          const reviewCount = mechanicReviews.length;
          if (reviewCount > 0) {
            const totalRating = mechanicReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
            rating = totalRating / reviewCount;
          }
          
          // Create the local mechanic object with Austin zip code
          const localMechanic = {
            id: 'local-mechanic',
            name: vendorName,
            avatar: vendorAvatar,
            specialties: typeof profile.specialties === 'string' 
              ? profile.specialties.split(',').map((s: string) => s.trim())
              : Array.isArray(profile.specialties) ? profile.specialties : ['General Repairs'],
            rating: rating,
            reviewCount: reviewCount,
            location: profile.location || 'Austin, TX',
            hourlyRate: profile.hourlyRate || 85,
            zipCode: profile.zipCode || '78730' // Default to Austin if not set
          };
          
          console.log('Adding local mechanic to display list:', localMechanic);
          displayMechanics = [...displayMechanics, localMechanic];
        } catch (error) {
          console.error('Error parsing mechanic profile:', error);
        }
      }
    }

    // Add dummy vendor profile for customer views if needed
    if (currentUserRole === 'customer' && !hasLocalMechanic && displayMechanics.length === 0) {
      try {
        // Get vendor information from localStorage or use defaults
        const vendorName = localStorage.getItem('vendorName') || 'Mike Rodriguez';
        const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
        
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
        
        // Create a default vendor profile with Austin zip code
        const defaultVendor = {
          id: 'default-vendor',
          name: vendorName,
          avatar: vendorAvatar,
          specialties: ['General Repairs', 'Diagnostics'],
          rating: rating,
          reviewCount: reviewCount,
          location: 'Austin, TX',
          hourlyRate: 85,
          zipCode: '78730' // Austin, TX zip code
        };
        
        console.log('Adding default vendor for customer view:', defaultVendor);
        displayMechanics = [...displayMechanics, defaultVendor];
      } catch (error) {
        console.error('Error adding default vendor:', error);
      }
    }

    // Filter mechanics based on zip code
    let filteredMechanics = displayMechanics;
    
    if (zipCode) {
      // When filtering by zip code, include mechanics that match the zip prefix or exact zip
      filteredMechanics = displayMechanics.filter(mechanic => {
        console.log(`Filtering mechanic: ${mechanic.name}, id: ${mechanic.id}, zip: ${mechanic.zipCode || 'NO_ZIP'}`);
        
        // If mechanic has a zip code that matches the search exactly, include it
        if (mechanic.zipCode === zipCode) {
          console.log(`✓ EXACT MATCH: ${mechanic.name} - zip matches exactly`);
          return true;
        }
        
        // If mechanic has a zip code that starts with the first 3 digits, include it
        if (mechanic.zipCode && mechanic.zipCode.startsWith(zipCode.substring(0, 3))) {
          console.log(`✓ PREFIX MATCH: ${mechanic.name} - zip starts with ${zipCode.substring(0, 3)}`);
          return true;
        }
        
        // Special case for vendors - ensure they're included when zip matches
        if ((mechanic.id === 'local-mechanic' || mechanic.id === 'default-vendor') && 
            mechanic.zipCode && mechanic.zipCode.startsWith(zipCode.substring(0, 3))) {
          console.log(`✓ VENDOR MATCH: ${mechanic.name} - vendor zip prefix match`);
          return true;
        }
        
        // Does not match
        console.log(`✗ NO MATCH: ${mechanic.name}`);
        return false;
      });
      
      // Log the mechanics after filtering
      console.log('Zip code search:', zipCode);
      console.log('Mechanics before zip filtering:', displayMechanics.map(m => `${m.name} (${m.zipCode || 'NO_ZIP'})`));
      console.log('Mechanics after zip filtering:', filteredMechanics.map(m => `${m.name} (${m.zipCode || 'NO_ZIP'})`));
    }
    
    // Final log of what's being displayed
    console.log('Final mechanics list:', filteredMechanics.map(m => `${m.name} (${m.id})`));
    return filteredMechanics;
  }, [mechanics, zipCode, currentUserRole]);
}
