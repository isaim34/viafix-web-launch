
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AddReviewFormProps {
  mechanicId: string;
  mechanicName: string;
  onReviewAdded?: () => void;
}

interface ReviewFormValues {
  rating: number;
  comment: string;
}

export const AddReviewForm = ({ mechanicId, mechanicName, onReviewAdded }: AddReviewFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  
  const form = useForm<ReviewFormValues>({
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });

  const handleSubmit = async (values: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (values.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the user's name from profile if available, otherwise use email
      const userDisplayName = user.user_metadata?.full_name || user.email || 'Anonymous';
      
      // Insert the review into the database
      const { error } = await supabase
        .from('mechanic_reviews')
        .insert({
          mechanic_id: mechanicId,
          customer_id: user.id,
          author: userDisplayName,
          rating: values.rating,
          text: values.comment
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Review Submitted",
        description: `Your review for ${mechanicName} has been submitted successfully.`,
      });
      
      // Reset the form
      form.reset({
        rating: 0,
        comment: '',
      });
      
      // Call the callback if provided
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: `Failed to submit review: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex items-center mb-4">
            <span className="mr-2 text-sm">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => form.setValue('rating', star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      (hoverRating ? hoverRating >= star : form.watch('rating') >= star)
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Share your experience with ${mechanicName}...`}
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
