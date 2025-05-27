
import React from 'react';
import { Star } from 'lucide-react';

interface MechanicRatingProps {
  rating: number;
  reviewCount: number;
}

export const MechanicRating = ({ rating, reviewCount }: MechanicRatingProps) => {
  // Ensure we have valid numbers with better validation
  const displayRating = typeof rating === 'number' && !isNaN(rating) && rating > 0 ? rating : 0;
  const displayReviewCount = typeof reviewCount === 'number' && !isNaN(reviewCount) ? reviewCount : 0;
  
  console.log('MechanicRating - Display values:', { 
    originalRating: rating, 
    originalReviewCount: reviewCount, 
    displayRating, 
    displayReviewCount 
  });
  
  return (
    <div className="flex items-center mb-3">
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className="ml-1 font-medium">
        {displayRating > 0 ? displayRating.toFixed(1) : '0.0'}
      </span>
      <span className="ml-1 text-gray-500">
        ({displayReviewCount} review{displayReviewCount !== 1 ? 's' : ''})
      </span>
      {displayRating === 0 && displayReviewCount === 0 && (
        <span className="ml-2 text-xs text-gray-400">New mechanic</span>
      )}
    </div>
  );
};
