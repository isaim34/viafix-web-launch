import { MechanicProfile } from '@/hooks/useMechanics';

export const matchesSearchTerm = (mechanic: MechanicProfile, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // Check name
  if (mechanic.name && typeof mechanic.name === 'string' && 
      mechanic.name.toLowerCase().includes(lowerSearchTerm)) {
    return true;
  }
  
  // Check specialties with proper type handling
  if (mechanic.specialties) {
    if (Array.isArray(mechanic.specialties)) {
      // Use Array.some with explicit type checking
      return mechanic.specialties.some((specialty: unknown) => {
        return typeof specialty === 'string' && specialty.toLowerCase().includes(lowerSearchTerm);
      });
    } else if (typeof mechanic.specialties === 'string') {
      if (mechanic.specialties.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
    }
  }
  
  // Check location
  if (mechanic.location && typeof mechanic.location === 'string' && 
      mechanic.location.toLowerCase().includes(lowerSearchTerm)) {
    return true;
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
