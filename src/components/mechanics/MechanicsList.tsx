
import React, { useEffect } from 'react';
import { MechanicCard } from '@/components/MechanicCard';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { mechanicsData } from '@/data/mechanicsPageData';
import { Link } from 'react-router-dom';

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

interface MechanicsListProps {
  mechanics: Mechanic[];
  zipCode: string;
  locationName?: string;
  isLoading?: boolean;
  setZipCode: (zipCode: string) => void;
}

const MechanicsList = ({ mechanics, zipCode, locationName, setZipCode }: MechanicsListProps) => {
  const locationDisplay = locationName || zipCode;
  const { currentUserId, currentUserRole } = useCustomerAuth();
  
  // Log the current user role and mechanics data for debugging
  useEffect(() => {
    console.log('MechanicsList - Current user role:', currentUserRole);
    console.log('MechanicsList - Mechanics provided:', mechanics.length, mechanics.map(m => m.id));
    console.log('MechanicsList - Current zip code:', zipCode);
    
    // Check if the local mechanic profile exists in localStorage
    const storedProfile = localStorage.getItem('mechanicProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        console.log('MechanicsList - Local mechanic profile found:', profile);
        console.log('MechanicsList - Local mechanic profile zip code:', profile.zipCode);
      } catch (error) {
        console.error('Error parsing mechanic profile:', error);
      }
    } else {
      console.log('MechanicsList - No local mechanic profile found in localStorage');
    }
  }, [currentUserRole, mechanics, zipCode]);
  
  useEffect(() => {
    // Check if component is mounting and if the zip code should be auto-populated
    const shouldAutoPopulate = () => {
      // Don't auto-populate if zip code is already set
      if (zipCode) return false;
      
      // Don't auto-populate if user manually cleared zip code
      if (sessionStorage.getItem('zipCodeManuallyCleared') === 'true') {
        console.log('Zip code was manually cleared, not auto-populating');
        return false;
      }
      
      return true;
    };
    
    // Only auto-populate zip code for mechanics
    if (shouldAutoPopulate() && currentUserRole === 'mechanic') {
      const storedProfileData = localStorage.getItem('mechanicProfile');
      if (storedProfileData) {
        try {
          const parsedData = JSON.parse(storedProfileData);
          if (parsedData.zipCode) {
            console.log('Found profile zip code:', parsedData.zipCode);
            setZipCode(parsedData.zipCode);
          }
        } catch (error) {
          console.error('Error parsing profile data from localStorage:', error);
        }
      }
    }
  }, [zipCode, setZipCode, currentUserRole]);

  // Force check to see if the local mechanic should be included but isn't
  useEffect(() => {
    if (currentUserRole === 'mechanic' && zipCode === '01605') {
      const existingLocalMechanic = mechanics.find(m => m.id === 'local-mechanic');
      
      if (!existingLocalMechanic) {
        console.log('Local mechanic profile should be included for 01605 but is not present');
        
        // Check if the profile data matches
        const mechanicProfile = localStorage.getItem('mechanicProfile');
        if (mechanicProfile) {
          try {
            const profile = JSON.parse(mechanicProfile);
            console.log('Local profile data:', profile);
            console.log('Profile zip code matches search?', profile.zipCode === zipCode);
          } catch (error) {
            console.error('Error parsing profile:', error);
          }
        }
      } else {
        console.log('Local mechanic is included in results:', existingLocalMechanic);
      }
    }
  }, [currentUserRole, mechanics, zipCode]);

  // Determine which mechanics to display, including local mechanic profile
  const displayMechanics = mechanics.length > 0 
    ? mechanics 
    : (zipCode === '01605' ? mechanicsData.filter(m => m.zipCode === '01605') : []);

  // Check if user is logged in as a mechanic
  const userRole = localStorage.getItem('userRole');
  const isLoggedInMechanic = userRole === 'mechanic';

  // Check if the current mechanic should be included in search results
  const shouldIncludeCurrentMechanic = isLoggedInMechanic && zipCode && displayMechanics.findIndex(m => m.id === 'local-mechanic') === -1;
  
  // If local mechanic exists but not in results, check if their zip code matches the search
  useEffect(() => {
    if (shouldIncludeCurrentMechanic && zipCode) {
      const mechanicProfile = localStorage.getItem('mechanicProfile');
      if (mechanicProfile) {
        try {
          const profile = JSON.parse(mechanicProfile);
          if (profile.zipCode === zipCode) {
            console.log('Local mechanic should be in results but is missing. Zip codes match:', profile.zipCode, zipCode);
          }
        } catch (error) {
          console.error('Error checking mechanic profile zip code:', error);
        }
      }
    }
  }, [shouldIncludeCurrentMechanic, zipCode]);

  return (
    <div className="w-full">
      <p className="text-gray-500 mb-6">
        {zipCode ? 
          `Showing ${displayMechanics.length} mechanics near ${locationDisplay}` : 
          `Showing ${displayMechanics.length} mechanics`
        }
      </p>
      
      {displayMechanics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMechanics.map((mechanic, index) => {
            // Check if this is the logged-in mechanic's profile
            const isCurrentMechanic = mechanic.id === 'local-mechanic';
            
            // For the local mechanic card, we'll wrap it in a Link to the dashboard
            if (isCurrentMechanic && isLoggedInMechanic) {
              return (
                <Link to="/mechanic-dashboard" key={mechanic.id} className="block h-full">
                  <MechanicCard 
                    {...mechanic} 
                    delay={index * 0.1}
                  />
                </Link>
              );
            }
            
            // For all other mechanics, use the normal MechanicCard with its built-in link
            return (
              <MechanicCard 
                key={mechanic.id} 
                {...mechanic} 
                delay={index * 0.1}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No mechanics found</h3>
          <p className="text-gray-500 mb-6">
            {zipCode 
              ? `No mechanics found in the ${locationDisplay} area. Please try a different zip code.`
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MechanicsList;
