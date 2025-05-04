
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
    console.log('useDisplayedMechanics - Starting with params:', { 
      mechanicsCount: mechanics.length,
      zipCode,
      currentUserRole
    });
    
    // If we have mechanics, use them; otherwise, use default data
    let displayMechanics = mechanics.length > 0
      ? mechanics
      : (zipCode ? mechanicsData.filter(m => m.zipCode?.startsWith(zipCode.substring(0, 3))) : mechanicsData);

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
          
          const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
          const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
          
          // Create the local mechanic object with explicit zipCode
          const localMechanic = {
            id: 'local-mechanic',
            name: vendorName,
            avatar: vendorAvatar,
            specialties: typeof profile.specialties === 'string' 
              ? profile.specialties.split(',').map((s: string) => s.trim())
              : Array.isArray(profile.specialties) ? profile.specialties : ['General Repairs'],
            rating: 5.0,
            reviewCount: 0,
            location: profile.location || 'Worcester, MA',
            hourlyRate: profile.hourlyRate || 75,
            zipCode: profile.zipCode || '01605'
          };
          
          console.log('Adding local mechanic to display list:', localMechanic);
          // Add it to the display mechanics
          displayMechanics = [...displayMechanics, localMechanic];
        } catch (error) {
          console.error('Error parsing mechanic profile:', error);
        }
      }
    }

    // For customer searches, we need to ensure a dummy vendor profile is always available
    // if the current user is a customer and there's no vendor profile yet
    if (currentUserRole === 'customer' && !hasLocalMechanic) {
      // Add a default vendor profile for customers to see
      try {
        // Get vendor information from localStorage
        const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
        const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
        
        // Create a default vendor profile
        const defaultVendor = {
          id: 'default-vendor',
          name: vendorName,
          avatar: vendorAvatar,
          specialties: ['General Repairs', 'Diagnostics'],
          rating: 5.0,
          reviewCount: 12,
          location: 'Worcester, MA',
          hourlyRate: 75,
          zipCode: '01605' // Hard-coded for Worcester, MA
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
      // When filtering by zip code, include all mechanics that match the zip prefix
      filteredMechanics = displayMechanics.filter(mechanic => {
        // Log each mechanic's zip code for debugging
        console.log(`Filtering mechanic: ${mechanic.name}, id: ${mechanic.id}, zip: ${mechanic.zipCode || 'NO_ZIP'}`);
        
        // If mechanic has a zip code that matches the search, include it
        if (mechanic.zipCode && mechanic.zipCode.startsWith(zipCode.substring(0, 3))) {
          console.log(`✓ MATCH: ${mechanic.name} - zip starts with ${zipCode.substring(0, 3)}`);
          return true;
        }
        
        // Special case for vendors - ensure they're included when zip matches exactly
        if ((mechanic.id === 'local-mechanic' || mechanic.id === 'default-vendor') && 
            mechanic.zipCode === zipCode) {
          console.log(`✓ VENDOR MATCH: ${mechanic.name} - exact zip match`);
          return true;
        }
        
        // Special case for Worcester, MA
        if (zipCode === '01605' && mechanic.zipCode === '01605') {
          console.log(`✓ WORCESTER MATCH: ${mechanic.name}`);
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
      
      // If we don't have any results and are searching for Worcester, hardcode it
      if (filteredMechanics.length === 0 && zipCode === '01605') {
        console.log('No results for Worcester, adding default mechanics');
        // Add some default mechanics for Worcester
        const worcesterDefaults = displayMechanics.filter(m => m.id === 'local-mechanic' || m.id === 'default-vendor');
        if (worcesterDefaults.length > 0) {
          console.log('Adding Worcester default mechanics:', worcesterDefaults.map(m => m.name));
          filteredMechanics = worcesterDefaults;
        }
      }
    }
    
    // Final log of what's being displayed
    console.log('Final mechanics list:', filteredMechanics.map(m => `${m.name} (${m.id})`));
    return filteredMechanics;
  }, [mechanics, zipCode, currentUserRole]);
}
