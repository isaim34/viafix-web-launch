
import { MechanicProfile } from '@/hooks/useMechanics';

/**
 * Checks if a mechanic matches the given search term
 * Searches across name, specialties, and location fields
 */
export const matchesSearchTerm = (mechanic: MechanicProfile, searchTerm: string): boolean => {
  if (!searchTerm?.trim()) {
    return true;
  }
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  // Check name field
  if (typeof mechanic.name === 'string' && mechanic.name.toLowerCase().includes(normalizedSearchTerm)) {
    return true;
  }
  
  // Check specialties field
  if (mechanic.specialties) {
    if (Array.isArray(mechanic.specialties)) {
      const hasMatchingSpecialty = mechanic.specialties.some((specialty) => {
        return typeof specialty === 'string' && specialty.toLowerCase().includes(normalizedSearchTerm);
      });
      if (hasMatchingSpecialty) {
        return true;
      }
    } else if (typeof mechanic.specialties === 'string') {
      if (mechanic.specialties.toLowerCase().includes(normalizedSearchTerm)) {
        return true;
      }
    }
  }
  
  // Check location field
  if (typeof mechanic.location === 'string' && mechanic.location.toLowerCase().includes(normalizedSearchTerm)) {
    return true;
  }
  
  return false;
};

/**
 * Checks if a mechanic matches the given zip code
 * Supports exact matches and city/location name matching
 */
export const matchesZipCode = (
  mechanic: MechanicProfile, 
  zipCode: string, 
  locationName: string
): boolean => {
  if (!zipCode?.trim()) {
    return true;
  }
  
  const normalizedZipCode = zipCode.trim();
  
  // Check for exact zip code match
  if (mechanic.zipCode === normalizedZipCode) {
    return true;
  }
  
  // Check for city/location matches when location name is provided
  if (locationName?.trim() && typeof mechanic.location === 'string') {
    const cityName = locationName.split(',')[0]?.toLowerCase().trim();
    const mechanicLocation = mechanic.location.toLowerCase();
    
    if (cityName && mechanicLocation.includes(cityName)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Determines if a mechanic should be excluded from search results
 * Currently excludes customer's own profile when they're viewing as a customer
 */
export const shouldExcludeMechanic = (mechanic: MechanicProfile, userRole: string): boolean => {
  // Exclude customer's own profile when they're logged in as a customer
  return userRole === 'customer' && mechanic.id === 'local-mechanic';
};
