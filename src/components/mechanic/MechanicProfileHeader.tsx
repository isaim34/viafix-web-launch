
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { MechanicDetail } from '@/types/mechanic';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import { MechanicRating } from './MechanicRating';
import { MechanicSpecialties } from './MechanicSpecialties';
import { MechanicDetails } from './MechanicDetails';

interface MechanicProfileHeaderProps {
  mechanic: MechanicDetail;
  isCustomerLoggedIn: boolean;
}

export const MechanicProfileHeader = ({ mechanic, isCustomerLoggedIn }: MechanicProfileHeaderProps) => {
  return (
    <>
      <Link to="/mechanics" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm">
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        <span>Back to mechanics</span>
      </Link>
      
      <motion.div 
        className="glass-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row">
          <img 
            src={mechanic.avatar} 
            alt={mechanic.name} 
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl object-cover mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex-1">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">{mechanic.name}</h1>
                <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  <Check className="h-4 w-4 mr-1 text-green-600" />
                  Verified
                </div>
              </div>
              
              <div className="flex gap-2">
                <ShareButton mechanicName={mechanic.name} />
                <FavoriteButton 
                  mechanicId={mechanic.id}
                  mechanicName={mechanic.name}
                  isCustomerLoggedIn={isCustomerLoggedIn}
                  mechanicData={{
                    id: mechanic.id,
                    name: mechanic.name,
                    avatar: mechanic.avatar,
                    location: mechanic.location,
                    rating: mechanic.rating,
                    hourlyRate: mechanic.hourlyRate
                  }}
                />
              </div>
            </div>
            
            <MechanicRating rating={mechanic.rating} reviewCount={mechanic.reviewCount} />
            <MechanicSpecialties specialties={mechanic.specialties} />
            <MechanicDetails 
              location={mechanic.location}
              responseTime={mechanic.responseTime}
              yearsExperience={mechanic.yearsExperience}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};
