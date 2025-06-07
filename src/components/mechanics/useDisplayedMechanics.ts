
import { useMemo } from 'react';
import { MechanicProfile } from '@/hooks/useMechanics';

// Returns filtered mechanics to display from Supabase only
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
    
    // Start with the mechanics from the database only
    let displayMechanics = [...mechanics];

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
