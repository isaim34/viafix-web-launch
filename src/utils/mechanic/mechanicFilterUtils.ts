import { MechanicProfile } from '@/hooks/useMechanics';

export const matchesSearchTerm = (mechanic: MechanicProfile, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // Check name
  if (mechanic.name && typeof mechanic.name === 'string') {
    if (mechanic.name.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
  }
  
  // Check specialties with proper type handling
  const specialties = mechanic.specialties;

  if (Array.isArray(specialties)) {
    return specialties.some((item: unknown): item is string => {
      return typeof item === 'string' && item.toLowerCase().includes(lowerSearchTerm);
    });
  } else if (typeof specialties === 'string') {
    return specialties.toLowerCase().includes(lowerSearchTerm);
  }
  
  // Check location with proper type guard
  if (mechanic.location && typeof mechanic.location === 'string') {
    if (mechanic.location.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
  }
  
  return false;
};

export const matchesZipCode = (
  mechanic: MechanicProfile, 
  zipCode: string, 
  locationName: string,
  userRole: string
): boolean => {
  if (!zipCode) return true;
  
  // Special case for Worcester, MA
  if (zipCode === '01605') {
    if (mechanic.id === 'local-mechanic' && userRole !== 'customer') return true;
    return mechanic.zipCode === '01605';
  }
  
  // For any other zip code, check direct match
  if (mechanic.zipCode === zipCode) {
    return true;
  }
  
  // Also check for city/location matches when we have a location name
  if (locationName && mechanic.location && typeof mechanic.location === 'string') {
    const cityName = locationName.split(',')[0].toLowerCase().trim();
    const mechanicCity = mechanic.location.toLowerCase();
    return mechanicCity.includes(cityName);
  }
  
  return false;
};

export const shouldExcludeMechanic = (mechanic: MechanicProfile, userRole: string): boolean => {
  // For logged-in customers, never include their own profile as a mechanic
  return userRole === 'customer' && mechanic.id === 'local-mechanic';
};
