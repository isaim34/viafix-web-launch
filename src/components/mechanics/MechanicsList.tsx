
import React from 'react';
import { MechanicCardWrapper } from './MechanicCardWrapper';
import { MechanicProfile } from '@/hooks/useMechanics';

interface MechanicsListProps {
  mechanics: MechanicProfile[];
  zipCode: string;
  locationName: string;
  setZipCode: (zipCode: string) => void;
}

export const MechanicsList = ({ mechanics, zipCode, locationName, setZipCode }: MechanicsListProps) => {
  const hasLocationName = Boolean(locationName);
  
  return (
    <div>
      {mechanics.length > 0 ? (
        <div className="mt-6">
          {locationName && (
            <h2 className="text-xl font-semibold mb-4">
              Mobile mechanics{hasLocationName ? ` in ${locationName}` : ''}
            </h2>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map((mechanic) => (
              <MechanicCardWrapper key={mechanic.id} mechanic={mechanic} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10 text-center py-10 px-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No mechanics found</h3>
          <p className="text-gray-600 mb-4">
            {zipCode 
              ? `We couldn't find any mechanics in the ${zipCode} area.` 
              : 'Enter a zip code to find mechanics in your area.'}
          </p>
          {zipCode && (
            <button 
              onClick={() => setZipCode('')} 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear zip code filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MechanicsList;
