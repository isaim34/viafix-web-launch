
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  text: z.string().min(10, "Review should be at least 10 characters long").max(500),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface AddReviewFormProps {
  mechanicId: string;
  mechanicName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddReviewForm = ({ mechanicId, mechanicName, onSuccess, onCancel }: AddReviewFormProps) => {
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      text: '',
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    // Prevent duplicate submissions
    if (isSubmitting) {
      console.log('Submission already in progress, ignoring duplicate');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting review submission for mechanic:', mechanicId);
      
      const { data: user, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        toast({
          title: "Authentication Error",
          description: "Failed to get user information. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }
      
      if (!user.user) {
        console.log('No user found');
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit a review",
          variant: "destructive",
        });
        return;
      }
      
      console.log('User authenticated:', user.user.id);
      
      // Get user's name from profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.user.id)
        .single();
      
      if (profileError) {
        console.log('Profile fetch error (non-critical):', profileError);
      }
      
      const authorName = profiles 
        ? `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim() 
        : user.user.email?.split('@')[0] || 'Anonymous';
      
      console.log('Author name resolved to:', authorName);
      console.log('Submitting review data:', {
        mechanic_id: mechanicId,
        customer_id: user.user.id,
        user_id: user.user.id,
        author: authorName,
        rating: values.rating,
        text: values.text
      });
      
      // Always store reviews in Supabase - use mechanicId as text field
      const { error } = await supabase
        .from('mechanic_reviews')
        .insert({
          mechanic_id: mechanicId, // Store as text, even for special IDs like 'default-vendor'
          customer_id: user.user.id,
          user_id: user.user.id, // Include user_id for ownership tracking
          author: authorName,
          rating: values.rating,
          text: values.text
        });
      
      if (error) {
        console.error('Supabase insert error:', error);
        toast({
          title: "Error",
          description: `Failed to submit your review: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Review submitted successfully');
      toast({
        title: "Review Submitted",
        description: `Thank you for reviewing ${mechanicName}!`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Unexpected error in review submission:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue('rating', rating);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormLabel>Rating</FormLabel>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingClick(rating)}
                className="focus:outline-none"
                disabled={isSubmitting}
              >
                <Star 
                  className={`w-8 h-8 cursor-pointer ${
                    rating <= selectedRating 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              </button>
            ))}
          </div>
          {form.formState.errors.rating && (
            <p className="text-sm font-medium text-destructive">
              Please select a rating
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this mechanic..."
                  className="resize-none min-h-[100px]"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
