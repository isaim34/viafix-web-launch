
import React from 'react';
import { Wrench } from 'lucide-react';

interface MechanicSpecialtiesProps {
  specialties: string[];
}

export const MechanicSpecialties = ({ specialties }: MechanicSpecialtiesProps) => {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
      {specialties.map((specialty, index) => (
        <span 
          key={index} 
          className="inline-flex items-center bg-blue-50 rounded-full px-2 sm:px-3 py-1 text-xs font-medium text-blue-700"
        >
          <Wrench className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate max-w-[150px]">{specialty}</span>
        </span>
      ))}
    </div>
  );
};
