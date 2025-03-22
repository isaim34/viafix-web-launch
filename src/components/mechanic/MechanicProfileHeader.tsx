
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Wrench, Clock, Calendar, ArrowLeft, Shield, Heart } from 'lucide-react';
import { MechanicDetail } from '@/types/mechanic';
import { useToast } from '@/hooks/use-toast';
import { isMechanicFavorite, toggleMechanicFavorite } from '@/utils/favoriteUtils';

interface MechanicProfileHeaderProps {
  mechanic: MechanicDetail;
  isCustomerLoggedIn: boolean;
}

export const MechanicProfileHeader = ({ mechanic, isCustomerLoggedIn }: MechanicProfileHeaderProps) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // Check if this mechanic is already a favorite
    if (isCustomerLoggedIn) {
      setIsFavorite(isMechanicFavorite(mechanic.id));
    }
  }, [mechanic.id, isCustomerLoggedIn]);
  
  const handleToggleFavorite = () => {
    if (!isCustomerLoggedIn) {
      // Notify user they need to sign in
      toast({
        title: "Authentication Required",
        description: "Please sign in as a customer to save favorite mechanics.",
        variant: "destructive",
      });
      return;
    }
    
    // Toggle favorite status
    const newFavoriteStatus = toggleMechanicFavorite({
      id: mechanic.id,
      name: mechanic.name,
      avatar: mechanic.avatar,
      location: mechanic.location,
      rating: mechanic.rating,
      hourlyRate: mechanic.hourlyRate
    });
    
    setIsFavorite(newFavoriteStatus);
    
    // Show toast notification
    toast({
      title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
      description: newFavoriteStatus 
        ? `${mechanic.name} has been added to your favorites.` 
        : `${mechanic.name} has been removed from your favorites.`,
    });
  };

  return (
    <>
      <Link to="/mechanics" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Back to mechanics</span>
      </Link>
      
      <motion.div 
        className="glass-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row">
          <img 
            src={mechanic.avatar} 
            alt={mechanic.name} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-3">{mechanic.name}</h1>
                <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </div>
              </div>
              
              <button 
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-all ${
                  isFavorite 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            </div>
            
            <div className="flex items-center mb-3">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{mechanic.rating.toFixed(1)}</span>
              <span className="ml-1 text-gray-500">({mechanic.reviewCount} reviews)</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {mechanic.specialties.map((specialty, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center bg-blue-50 rounded-full px-3 py-1 text-xs font-medium text-blue-700"
                >
                  <Wrench className="w-3 h-3 mr-1" />
                  {specialty}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {mechanic.location}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                Response: {mechanic.responseTime}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                {mechanic.yearsExperience} years experience
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
