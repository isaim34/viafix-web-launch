
import { useMemo } from 'react';
import { mechanicsData } from '@/data/mechanicsPageData';

interface Mechanic {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  galleryImages?: string[];
  zipCode?: string;
}

// Returns filtered mechanics to display (already respecting currentUserRole, etc)
export function useDisplayedMechanics(
  mechanics: Mechanic[],
  zipCode: string,
  currentUserRole: string | null
) {
  return useMemo(() => {
    // If we have mechanics, use them; otherwise, use default data
    let displayMechanics = mechanics.length > 0
      ? mechanics
      : (zipCode ? mechanicsData.filter(m => m.zipCode?.startsWith(zipCode.substring(0, 3))) : mechanicsData);

    // Check if the local mechanic (vendor) exists in the mechanics list
    const hasLocalMechanic = displayMechanics.some(m => m.id === 'local-mechanic');
    
    // Add the local mechanic if it's not already in the list (for mechanic users only)
    if (!hasLocalMechanic && currentUserRole === 'mechanic') {
      const mechanicProfile = localStorage.getItem('mechanicProfile');
      if (mechanicProfile) {
        try {
          const profile = JSON.parse(mechanicProfile);
          const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
          const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
          
          // Create the local mechanic object
          const localMechanic = {
            id: 'local-mechanic',
            name: vendorName,
            avatar: vendorAvatar,
            specialties: typeof profile.specialties === 'string' 
              ? profile.specialties.split(',').map((s: string) => s.trim())
              : profile.specialties || ['General Repairs'],
            rating: 5.0,
            reviewCount: 0,
            location: profile.location || 'Worcester, MA',
            hourlyRate: profile.hourlyRate || 75,
            zipCode: profile.zipCode || '01605'
          };
          
          // Add it to the display mechanics
          displayMechanics = [...displayMechanics, localMechanic];
        } catch (error) {
          console.error('Error parsing mechanic profile:', error);
        }
      }
    }

    // Always include the local mechanic for customers if no zip code filtering or if it matches the zip search
    // This ensures vendor accounts pop up in customer searches by zip code
    let filteredMechanics = displayMechanics;
    
    if (zipCode) {
      // When filtering by zip code, include all mechanics that match the zip prefix
      filteredMechanics = displayMechanics.filter(mechanic => {
        // If mechanic has a zip code that matches the search, include it
        if (mechanic.zipCode && mechanic.zipCode.startsWith(zipCode.substring(0, 3))) {
          return true;
        }
        
        // Special case for Isai Mercado (or any vendor) - ensure it's always included when zip matches
        if (mechanic.id === 'local-mechanic' && mechanic.zipCode === zipCode) {
          return true;
        }
        
        return false;
      });
      
      // Log information about the filtering process
      console.log('Zip code search:', zipCode);
      console.log('Mechanics before zip filtering:', displayMechanics.map(m => `${m.name} (${m.zipCode})`));
      console.log('Mechanics after zip filtering:', filteredMechanics.map(m => `${m.name} (${m.zipCode})`));
    }
    
    console.log('Displaying mechanics:', filteredMechanics.map(m => m.name));
    return filteredMechanics;
  }, [mechanics, zipCode, currentUserRole]);
}
