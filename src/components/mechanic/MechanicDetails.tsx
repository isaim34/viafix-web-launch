
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
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm text-gray-600">
      <div className="flex items-center">
        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
        {location}
      </div>
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-1 text-gray-400" />
        Response: {responseTime}
      </div>
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
        {yearsExperience} years experience
      </div>
    </div>
  );
};
