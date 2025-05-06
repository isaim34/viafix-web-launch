
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceTitle: string;
}

const ReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Get reviews from mechanic_reviews table
        const { data, error } = await supabase
          .from('mechanic_reviews')
          .select(`
            id,
            author,
            rating,
            text,
            created_at
          `)
          .eq('mechanic_id', user.id);
          
        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }

        console.log('Fetched reviews:', data?.length || 0);
        
        // Transform the data to match the Review interface
        const formattedReviews = data?.map(review => ({
          id: review.id,
          customerName: review.author || 'Anonymous',
          rating: review.rating || 0,
          comment: review.text || '',
          date: new Date(review.created_at).toISOString(),
          serviceTitle: 'Service' // Default service title since we're not getting it from the join
        })) || [];
        
        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error in fetchReviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [user]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Star className="h-8 w-8 text-muted-foreground" />
          <h3 className="font-semibold text-lg">No Reviews Yet</h3>
          <p className="text-muted-foreground">You haven't received any reviews yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{review.customerName}</h3>
                <p className="text-sm text-muted-foreground">{review.serviceTitle}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsTab;
