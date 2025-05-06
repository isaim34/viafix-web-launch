
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Review } from '@/types/mechanic';
import { AddReviewForm } from './AddReviewForm';

interface MechanicReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  delay?: number;
  mechanicId: string;
  mechanicName: string;
  isCustomerLoggedIn: boolean;
  onReviewAdded?: () => void;
}

export const MechanicReviews = ({ 
  reviews, 
  rating, 
  reviewCount, 
  delay = 0.3,
  mechanicId,
  mechanicName,
  isCustomerLoggedIn,
  onReviewAdded
}: MechanicReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 font-bold text-lg">{rating.toFixed(1)}</span>
            <span className="ml-1 text-gray-500">({reviewCount})</span>
          </div>
          
          {isCustomerLoggedIn && !showReviewForm && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Review
            </Button>
          )}
        </div>
      </div>
      
      {showReviewForm && (
        <div className="mb-6">
          <AddReviewForm 
            mechanicId={mechanicId}
            mechanicName={mechanicName}
            onReviewAdded={() => {
              setShowReviewForm(false);
              if (onReviewAdded) onReviewAdded();
            }}
          />
          <div className="mt-4 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review, index) => (
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
        </div>
      )}
    </motion.div>
  );
};
