
import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';

interface MechanicDetailsProps {
  location: string;
  responseTime: string;
  yearsExperience: number;
}

export const MechanicDetails = ({ 
  location, 
  responseTime, 
  yearsExperience 
}: MechanicDetailsProps) => {
  return (
    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 xs:items-center text-xs sm:text-sm text-gray-600">
      <div className="flex items-center">
        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
        {location}
      </div>
      <div className="flex items-center">
        <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
        Response: {responseTime}
      </div>
      <div className="flex items-center">
        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
        {yearsExperience} years experience
      </div>
    </div>
  );
};
