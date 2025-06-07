
import { useMemo } from 'react';
import { MechanicProfile } from '@/hooks/useMechanics';
import { buildMechanicsList } from '@/utils/mechanic/mechanicListBuilder';
import { matchesSearchTerm, matchesZipCode, shouldExcludeMechanic } from '@/utils/mechanic/mechanicFilterUtils';

export const useFilteredMechanics = (
  searchTerm: string,
  zipCode: string,
  locationName: string,
  mechanics: MechanicProfile[]
) => {
  return useMemo(() => {
    console.log('useFilteredMechanics running with:', { 
      searchTerm, 
      zipCode, 
      locationName,
      mechanicsCount: mechanics.length
    });
    
    const userRole = localStorage.getItem('userRole');
    
    // Build the complete list of mechanics (now just returns the Supabase mechanics)
    const allMechanics = buildMechanicsList(mechanics);
    
    // Filter mechanics based on search criteria
    const filteredMechanics = allMechanics.filter(mechanic => {
      console.log(`Filtering mechanic: ${mechanic.name}, id: ${mechanic.id}, zipCode: ${mechanic.zipCode}`);
      
      // Check if we should exclude this mechanic
      if (shouldExcludeMechanic(mechanic, userRole || '')) {
        console.log('Excluding customer\'s own account from mechanic results');
        return false;
      }
      
      // Check search term matches
      const searchMatches = matchesSearchTerm(mechanic, searchTerm);
      if (!searchMatches) {
        return false;
      }
      
      // Check zip code matches
      const zipMatches = matchesZipCode(mechanic, zipCode, locationName);
      
      const result = searchMatches && zipMatches;
      console.log(`Mechanic ${mechanic.name} included in results: ${result}`);
      return result;
    });
    
    console.log('Final filtered mechanics:', filteredMechanics.map(m => m.name));
    return filteredMechanics;
  }, [searchTerm, zipCode, locationName, mechanics]);
};
