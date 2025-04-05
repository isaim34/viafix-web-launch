
import React from 'react';
import { MechanicCard } from '@/components/MechanicCard';

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
}

const MechanicsList = ({ mechanics, zipCode, locationName }: MechanicsListProps) => {
  const locationDisplay = locationName || zipCode;

  return (
    <div className="w-full">
      <p className="text-gray-500 mb-6">
        {zipCode ? 
          `Showing ${mechanics.length} mechanics near ${locationDisplay}` : 
          `Showing ${mechanics.length} mechanics`
        }
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((mechanic) => (
          <MechanicCard 
            key={mechanic.id} 
            {...mechanic} 
          />
        ))}
      </div>
      
      {mechanics.length === 0 && (
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
