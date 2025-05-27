
import React from 'react';
import { Star } from 'lucide-react';

interface MechanicRatingProps {
  rating: number;
  reviewCount: number;
}

export const MechanicRating = ({ rating, reviewCount }: MechanicRatingProps) => {
  // Ensure we have valid numbers for display
  const displayRating = rating && !isNaN(rating) ? rating : 0;
  const displayReviewCount = reviewCount && !isNaN(reviewCount) ? reviewCount : 0;
  
  return (
    <div className="flex items-center mb-3">
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className="ml-1 font-medium">{displayRating.toFixed(1)}</span>
      <span className="ml-1 text-gray-500">
        ({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};
