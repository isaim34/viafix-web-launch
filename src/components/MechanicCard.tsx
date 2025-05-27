
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Wrench, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  disableLink?: boolean;
}

export const MechanicCard = ({
  id,
  name,
  avatar,
  specialties,
  rating: staticRating,
  reviewCount: staticReviewCount,
  location,
  hourlyRate,
  galleryImages,
  delay = 0,
  disableLink = false
}: MechanicCardProps) => {
  const [actualRating, setActualRating] = useState(staticRating);
  const [actualReviewCount, setActualReviewCount] = useState(staticReviewCount);

  useEffect(() => {
    const fetchRealReviewData = async () => {
      try {
        console.log('Fetching reviews for mechanic:', id);
        
        const { data: reviews, error } = await supabase
          .from('mechanic_reviews')
          .select('rating')
          .eq('mechanic_id', id);

        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }

        if (reviews && reviews.length > 0) {
          const validRatings = reviews.filter(r => r.rating && r.rating > 0);
          const avgRating = validRatings.length > 0 
            ? validRatings.reduce((sum, review) => sum + review.rating, 0) / validRatings.length
            : 0;
          
          setActualRating(avgRating);
          setActualReviewCount(reviews.length);
          
          console.log('Updated rating data:', {
            mechanicId: id,
            reviewCount: reviews.length,
            avgRating: avgRating
          });
        } else {
          // No reviews found, set to defaults
          setActualRating(0);
          setActualReviewCount(0);
        }
      } catch (error) {
        console.error('Error in fetchRealReviewData:', error);
      }
    };

    fetchRealReviewData();
  }, [id]);

  const cardContent = (
    <>
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
                <span className="ml-1 text-sm font-medium">
                  {actualRating > 0 ? actualRating.toFixed(1) : '0.0'}
                </span>
                <span className="ml-1 text-sm text-gray-500">({actualReviewCount})</span>
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
    </>
  );

  // Determine if this card should be a plain div or a Link
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden"
    >
      {disableLink ? (
        <div className="block h-full">
          {cardContent}
        </div>
      ) : (
        <Link to={`/mechanics/${id}`} className="block h-full">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
};
