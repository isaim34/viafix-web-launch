
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

    // Remove 'local-mechanic' from customer-facing results
    if (currentUserRole === 'customer') {
      displayMechanics = displayMechanics.filter(m => m.id !== 'local-mechanic');
    }
    return displayMechanics;
  }, [mechanics, zipCode, currentUserRole]);
}
