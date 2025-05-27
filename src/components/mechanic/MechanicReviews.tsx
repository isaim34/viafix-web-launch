
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Trash2 } from 'lucide-react';
import { Review } from '@/types/mechanic';
import { Button } from '@/components/ui/button';
import ReviewDialog from './ReviewDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Ensure we have valid data with better fallbacks
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const displayRating = typeof rating === 'number' && !isNaN(rating) && rating > 0 ? rating : 0;
  const displayReviewCount = typeof reviewCount === 'number' && !isNaN(reviewCount) ? reviewCount : safeReviews.length;
  
  console.log('MechanicReviews - Review display data:', {
    reviewsArray: safeReviews,
    reviewsLength: safeReviews.length,
    rating: displayRating,
    reviewCount: displayReviewCount,
    mechanicId,
    mechanicName,
    originalRating: rating,
    originalReviewCount: reviewCount
  });

  const handleDeleteReview = async (reviewId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to delete reviews.",
        variant: "destructive",
      });
      return;
    }

    setDeletingReviewId(reviewId);

    try {
      const { error } = await supabase
        .from('mechanic_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id); // Ensure user can only delete their own reviews

      if (error) {
        console.error('Error deleting review:', error);
        toast({
          title: "Error",
          description: "Failed to delete review. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Review Deleted",
        description: "Your review has been successfully deleted.",
      });

      // Refresh the reviews
      onReviewAdded();
    } catch (error) {
      console.error('Unexpected error deleting review:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingReviewId(null);
    }
  };

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
          <span className="ml-1 font-bold text-lg">
            {displayRating > 0 ? displayRating.toFixed(1) : '0.0'}
          </span>
          <span className="ml-1 text-gray-500">({displayReviewCount})</span>
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
      
      {safeReviews.length > 0 ? (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 mb-4">
            Showing {safeReviews.length} review{safeReviews.length !== 1 ? 's' : ''}
          </div>
          {safeReviews.map((review, index) => (
            <div key={`review-${index}`} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{review.author || 'Anonymous'}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${
                          star <= (review.rating || 0) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-200'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.rating || 0}/5
                    </span>
                  </div>
                  {/* Show delete button only for the review author */}
                  {user?.id && review.user_id === user.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingReviewId === review.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {review.text || 'No review text provided.'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-4">
            <Star className="w-12 h-12 mx-auto text-gray-300" />
          </div>
          <p className="text-lg font-medium mb-2">No reviews yet</p>
          <p className="text-sm">
            {isCustomerLoggedIn 
              ? "Be the first to leave a review for this mechanic!" 
              : "Sign in as a customer to leave the first review!"
            }
          </p>
        </div>
      )}
    </motion.div>
  );
};
