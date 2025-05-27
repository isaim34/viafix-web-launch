
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MechanicDetail } from '@/types/mechanic';
import { fetchMechanicProfile } from '@/services/mechanic/fetchMechanicProfile';
import { fetchLocalMechanic } from '@/services/mechanic/fetchLocalMechanic';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook to fetch and prepare mechanic data based on ID
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
  
  // Helper function to check if a string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };
  
  useEffect(() => {
    // Check if user is logged in as a mechanic
    const userRole = localStorage.getItem('userRole');
    const isLoggedInMechanic = userRole === 'mechanic';
    
    // If the user is a mechanic and trying to view a mechanic profile,
    // redirect them to their dashboard if it's their own profile (local-mechanic)
    if (isLoggedInMechanic && id === 'local-mechanic') {
      navigate('/mechanic-dashboard');
      return;
    }
    
    const fetchMechanicData = async () => {
      console.log('Starting to fetch mechanic data for ID:', id);
      setLoading(true);
      
      try {
        let mechanicData: MechanicDetail | null = null;
        
        // Handle special cases: default-vendor or local-mechanic
        if ((id === 'default-vendor' || id === 'local-mechanic')) {
          console.log('Fetching local mechanic data for:', id);
          mechanicData = await fetchLocalMechanic(id || '');
        } else {
          // For other mechanics, fetch from the database
          console.log('Fetching database mechanic data for:', id);
          mechanicData = await fetchMechanicProfile(id || '');
        }
        
        // Always fetch reviews from Supabase for all mechanics
        if (mechanicData && id) {
          try {
            console.log('Fetching reviews for mechanic ID:', id);
            
            const { data: reviews, error: reviewsError } = await supabase
              .from('mechanic_reviews')
              .select('id, author, rating, text, created_at')
              .eq('mechanic_id', id)
              .order('created_at', { ascending: false });
            
            if (reviewsError) {
              console.error('Error fetching reviews:', reviewsError);
              // Set default values on error
              mechanicData.reviews = [];
              mechanicData.reviewCount = 0;
              mechanicData.rating = 0;
            } else {
              console.log('Successfully fetched reviews:', {
                reviewsFound: reviews?.length || 0,
                reviews: reviews
              });
              
              if (reviews && reviews.length > 0) {
                // Map reviews to the expected format
                mechanicData.reviews = reviews.map(review => ({
                  author: review.author || 'Anonymous',
                  rating: review.rating || 0,
                  text: review.text || ''
                }));
                
                // Update review count
                mechanicData.reviewCount = reviews.length;
                
                // Calculate average rating
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
                // No reviews found
                mechanicData.reviews = [];
                mechanicData.reviewCount = 0;
                mechanicData.rating = 0;
                console.log('No reviews found for mechanic:', id);
              }
            }
          } catch (error) {
            console.error('Error in review fetching process:', error);
            // Set default values on error
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
