
import React, { useEffect } from 'react';
import { MechanicCard } from '@/components/MechanicCard';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
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
    // Check if the user has manually cleared the zip code
    const manuallyCleared = sessionStorage.getItem('zipCodeManuallyCleared') === 'true';
    
    // Only auto-set the zip code if it's not already set, and the user hasn't manually cleared it
    if (!zipCode && !manuallyCleared) {
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
          {displayMechanics.map((mechanic, index) => (
            <MechanicCard 
              key={mechanic.id} 
              {...mechanic} 
              delay={index * 0.1}
            />
          ))}
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
