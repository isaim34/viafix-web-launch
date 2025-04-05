
import React from 'react';
import { MechanicCard } from '@/components/MechanicCard';
import { Loader2 } from 'lucide-react';

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

const MechanicsList = ({ mechanics, zipCode, locationName, isLoading }: MechanicsListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Looking for mechanics near {zipCode}...</p>
      </div>
    );
  }
  
  return (
    <>
      <p className="text-gray-500 mb-6">
        {zipCode ? 
          `Showing ${mechanics.length} mechanics near ${zipCode}${locationName ? ` (${locationName})` : ''}` : 
          `Showing ${mechanics.length} mechanics`
        }
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((mechanic, index) => (
          <MechanicCard 
            key={mechanic.id} 
            {...mechanic} 
            delay={0.05 * index}
          />
        ))}
      </div>
      
      {mechanics.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No mechanics found</h3>
          <p className="text-gray-500 mb-6">
            {zipCode 
              ? `We couldn't find any mechanics near ${zipCode}. Try a different zip code or expand your search criteria.`
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      )}
    </>
  );
};

export default MechanicsList;
