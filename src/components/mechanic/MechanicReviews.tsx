
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { Review } from '@/types/mechanic';
import { Button } from '@/components/ui/button';
import ReviewDialog from './ReviewDialog';

interface MechanicReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  mechanicId: string;
  mechanicName: string;
  isCustomerLoggedIn: boolean;
  onReviewAdded: () => void;
  delay?: number;
}

export const MechanicReviews = ({ 
  reviews, 
  rating, 
  reviewCount, 
  mechanicId,
  mechanicName,
  isCustomerLoggedIn,
  onReviewAdded,
  delay = 0.3 
}: MechanicReviewsProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Ensure we have valid numbers for display
  const displayRating = rating && !isNaN(rating) ? rating : 0;
  const displayReviewCount = reviewCount && !isNaN(reviewCount) ? reviewCount : 0;
  const displayReviews = reviews || [];

  console.log('MechanicReviews render:', {
    mechanicId,
    rating: displayRating,
    reviewCount: displayReviewCount,
    reviewsLength: displayReviews.length
  });

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 font-bold text-lg">{displayRating.toFixed(1)}</span>
          <span className="ml-1 text-gray-500">
            ({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>
      
      {isCustomerLoggedIn && (
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsReviewDialogOpen(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
          <ReviewDialog 
            open={isReviewDialogOpen}
            onOpenChange={setIsReviewDialogOpen}
            mechanicId={mechanicId}
            mechanicName={mechanicName}
            onSuccess={onReviewAdded}
          />
        </div>
      )}
      
      {displayReviews.length > 0 ? (
        <div className="space-y-6">
          {displayReviews.map((review, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{review.author}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet</p>
          {isCustomerLoggedIn && (
            <p className="text-sm mt-2">Be the first to leave a review!</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
