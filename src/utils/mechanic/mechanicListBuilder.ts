
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { MechanicProfile } from '@/hooks/useMechanics';
import { createLocalMechanicProfile, createDefaultVendorMechanic } from './mechanicDataUtils';

export const buildMechanicsList = (
  mechanics: MechanicProfile[],
  localMechanicProfile: BasicProfileFormValues | null,
  locationName: string,
  zipCode: string,
  userRole: string
): MechanicProfile[] => {
  console.log('Building mechanics list with:', { 
    mechanicsCount: mechanics.length,
    userRole,
    hasLocalProfile: !!localMechanicProfile
  });
  
  // Start with all mechanics from the database
  const allMechanics = [...mechanics];
  
  // Only add mechanic's own profile to the list if they are logged in as a mechanic
  if (localMechanicProfile && localMechanicProfile.firstName && 
      localMechanicProfile.lastName && userRole === 'mechanic') {
    
    console.log('Adding local mechanic profile to list');
    
    // Check if the mechanic already exists in the list
    const existingMechanicIndex = allMechanics.findIndex(m => 
      m.name === `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}` || 
      m.id === 'local-mechanic'
    );
    
    const localMechanic = createLocalMechanicProfile(localMechanicProfile, locationName, userRole);
    
    if (existingMechanicIndex >= 0) {
      allMechanics[existingMechanicIndex] = localMechanic;
    } else {
      allMechanics.push(localMechanic);
    }
  }
  
  // Add default vendor mechanic ONLY for viewing by customers, not when customers themselves are logged in
  if (allMechanics.length === 0 && userRole !== 'customer') {
    const hasLocalMechanic = allMechanics.some(m => m.id === 'local-mechanic');
    
    if (!hasLocalMechanic) {
      console.log('Adding default vendor mechanic to results');
      const defaultVendorMechanic = createDefaultVendorMechanic(locationName, zipCode);
      allMechanics.push(defaultVendorMechanic);
    }
  }
  
  return allMechanics;
};
