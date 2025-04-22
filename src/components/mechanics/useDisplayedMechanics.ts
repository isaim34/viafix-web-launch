
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
    // If we have mechanics, show them.
    let displayMechanics = mechanics.length > 0
      ? mechanics
      : (zipCode ? mechanicsData.filter(m => m.zipCode?.startsWith(zipCode.substring(0, 3))) : mechanicsData);

    // Check if the local mechanic (vendor) exists in the mechanics list
    const hasLocalMechanic = displayMechanics.some(m => m.id === 'local-mechanic');
    
    // Add the local mechanic if it's not already in the list (for mechanic users only)
    if (!hasLocalMechanic && currentUserRole === 'mechanic') {
      // Try to get the local mechanic profile
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

    // Remove 'local-mechanic' from customer-facing results
    if (currentUserRole === 'customer') {
      displayMechanics = displayMechanics.filter(m => m.id !== 'local-mechanic');
    }
    
    console.log('Displaying mechanics:', displayMechanics.map(m => m.name));
    return displayMechanics;
  }, [mechanics, zipCode, currentUserRole]);
}
