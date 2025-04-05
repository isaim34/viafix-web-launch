
import React, { useEffect } from 'react';
import { MechanicCard } from '@/components/MechanicCard';
import { Loader2 } from 'lucide-react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

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

const MechanicsList = ({ mechanics, zipCode, locationName, isLoading, setZipCode }: MechanicsListProps) => {
  const locationDisplay = locationName || zipCode;
  const { currentUserId } = useCustomerAuth();
  
  // Check if user profile has a zip code stored in localStorage
  useEffect(() => {
    // Only apply this if no zipCode is currently set
    if (!zipCode) {
      // Get user's stored profile data
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

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Searching for mechanics...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-gray-500 mb-6">
        {zipCode ? 
          `Showing ${mechanics.length} mechanics near ${locationDisplay}` : 
          `Showing ${mechanics.length} mechanics`
        }
      </p>
      
      {mechanics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanics.map((mechanic) => (
            <MechanicCard 
              key={mechanic.id} 
              {...mechanic} 
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
