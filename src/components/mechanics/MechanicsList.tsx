
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
}

interface MechanicsListProps {
  mechanics: Mechanic[];
  zipCode: string;
}

const MechanicsList = ({ mechanics, zipCode }: MechanicsListProps) => {
  return (
    <>
      <p className="text-gray-500 mb-6">
        {zipCode ? 
          `Showing ${mechanics.length} mechanics near ${zipCode}` : 
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
      
      {mechanics.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No mechanics found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or zip code</p>
        </div>
      )}
    </>
  );
};

export default MechanicsList;
