
import React from 'react';
import { Star, MapPin, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface MechanicCardProps {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  delay?: number;
}

export const MechanicCard = ({
  id,
  name,
  avatar,
  specialties,
  rating,
  reviewCount,
  location,
  hourlyRate,
  delay = 0
}: MechanicCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden"
    >
      <Link to={`/mechanics/${id}`} className="block h-full">
        <div className="p-6">
          {/* Header with avatar and rating */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <img 
                src={avatar} 
                alt={name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                loading="lazy" 
              />
              <div className="ml-4">
                <h3 className="font-medium text-lg">{name}</h3>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
                  <span className="ml-1 text-sm text-gray-500">({reviewCount})</span>
                </div>
              </div>
            </div>
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
              ${hourlyRate}/hr
            </div>
          </div>
          
          {/* Specialties */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700"
                >
                  <Wrench className="w-3 h-3 mr-1" />
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
