
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MechanicDetail } from '@/types/mechanic';
import { fetchMechanicProfile } from '@/services/mechanic/fetchMechanicProfile';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook to fetch and prepare mechanic data based on ID from Supabase
 */
export const useMechanicData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mechanic, setMechanic] = useState<MechanicDetail | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refreshData = useCallback(() => {
    console.log('Refreshing mechanic data...');
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    const fetchMechanicData = async () => {
      console.log('Starting to fetch mechanic data for ID:', id);
      setLoading(true);
      
      try {
        if (!id) {
          setMechanic(null);
          setLoading(false);
          return;
        }

        // Fetch mechanic from the database
        console.log('Fetching database mechanic data for:', id);
        let mechanicData = await fetchMechanicProfile(id);
        
        // Always fetch reviews from Supabase for all mechanics
        if (mechanicData && id) {
          try {
            console.log('Fetching reviews for mechanic ID:', id);
            
            const { data: reviews, error: reviewsError } = await supabase
              .from('mechanic_reviews')
              .select('id, author, rating, text, created_at, user_id')
              .eq('mechanic_id', id)
              .order('created_at', { ascending: false });
            
            if (reviewsError) {
              console.error('Error fetching reviews:', reviewsError);
              mechanicData.reviews = [];
              mechanicData.reviewCount = 0;
              mechanicData.rating = 0;
            } else {
              console.log('Successfully fetched reviews:', {
                reviewsFound: reviews?.length || 0,
                reviews: reviews
              });
              
              if (reviews && reviews.length > 0) {
                mechanicData.reviews = reviews.map(review => ({
                  id: review.id,
                  author: review.author || 'Anonymous',
                  rating: review.rating || 0,
                  text: review.text || '',
                  user_id: review.user_id
                }));
                
                mechanicData.reviewCount = reviews.length;
                
                const validRatings = reviews.filter(r => r.rating && r.rating > 0);
                if (validRatings.length > 0) {
                  const totalRating = validRatings.reduce((sum, review) => sum + (review.rating || 0), 0);
                  mechanicData.rating = totalRating / validRatings.length;
                } else {
                  mechanicData.rating = 0;
                }
                
                console.log('Updated mechanic with review data:', {
                  reviewCount: mechanicData.reviewCount,
                  rating: mechanicData.rating,
                  reviewsArray: mechanicData.reviews
                });
              } else {
                mechanicData.reviews = [];
                mechanicData.reviewCount = 0;
                mechanicData.rating = 0;
                console.log('No reviews found for mechanic:', id);
              }
            }
          } catch (error) {
            console.error('Error in review fetching process:', error);
            mechanicData.reviews = [];
            mechanicData.reviewCount = 0;
            mechanicData.rating = 0;
          }
        }
        
        console.log('Final mechanic data:', mechanicData);
        setMechanic(mechanicData);
      } catch (error) {
        console.error('Error fetching mechanic data:', error);
        setMechanic(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMechanicData();
  }, [id, navigate, refreshTrigger]);

  // Log the selected mechanic for debugging
  useEffect(() => {
    console.log('useMechanicData - Final mechanic state:', {
      id: id,
      mechanicId: mechanic?.id,
      mechanicName: mechanic?.name,
      rating: mechanic?.rating,
      reviewCount: mechanic?.reviewCount,
      reviewsLength: mechanic?.reviews?.length,
      reviewsData: mechanic?.reviews,
      isNull: mechanic === null,
      loading
    });
  }, [id, mechanic, loading]);
  
  return { mechanic, id, loading, refreshData };
};
