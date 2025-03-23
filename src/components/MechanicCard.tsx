
import React from 'react';
import { Star, MapPin, Wrench, ImageIcon } from 'lucide-react';
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
  galleryImages?: string[];
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
  galleryImages,
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
        {/* Gallery Preview */}
        {galleryImages && galleryImages.length > 0 && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={galleryImages[0]} 
              alt={`${name}'s repair work`} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {galleryImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
                <ImageIcon className="w-3 h-3 mr-1" />
                +{galleryImages.length - 1}
              </div>
            )}
          </div>
        )}
        
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
