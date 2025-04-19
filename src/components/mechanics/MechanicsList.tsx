
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
  const { currentUserId } = useCustomerAuth();
  
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
    
    if (shouldAutoPopulate()) {
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
  }, [zipCode, setZipCode]);

  // Determine which mechanics to display
  const displayMechanics = mechanics.length > 0 
    ? mechanics 
    : (zipCode === '01605' ? mechanicsData.filter(m => m.zipCode === '01605') : []);

  // Check if user is logged in as a mechanic
  const userRole = localStorage.getItem('userRole');
  const isLoggedInMechanic = userRole === 'mechanic';

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
