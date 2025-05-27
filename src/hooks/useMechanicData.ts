
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
      setLoading(true);
      
      try {
        let mechanicData: MechanicDetail | null = null;
        
        // Handle special cases: default-vendor or local-mechanic
        if ((id === 'default-vendor' || id === 'local-mechanic')) {
          mechanicData = await fetchLocalMechanic(id || '');
        } else {
          // For other mechanics, fetch from the database
          mechanicData = await fetchMechanicProfile(id || '');
        }
        
        // Always fetch reviews from Supabase for all mechanics
        if (mechanicData && id) {
          try {
            console.log('Fetching reviews for mechanic:', id);
            
            const { data: reviews, error: reviewsError } = await supabase
              .from('mechanic_reviews')
              .select('id, author, rating, text, created_at')
              .eq('mechanic_id', id); // Query by exact mechanic_id, works for both UUIDs and special IDs
            
            if (reviewsError) {
              console.error('Error fetching reviews:', reviewsError);
            } else {
              console.log('Fetched reviews:', reviews?.length || 0, 'reviews');
              
              if (reviews && reviews.length > 0) {
                // Map reviews to the expected format
                mechanicData.reviews = reviews.map(review => ({
                  author: review.author,
                  rating: review.rating,
                  text: review.text || ''
                }));
                
                // Update review count
                mechanicData.reviewCount = reviews.length;
                
                // Calculate average rating
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                mechanicData.rating = totalRating / reviews.length;
                
                console.log('Updated mechanic data with reviews:', {
                  reviewCount: mechanicData.reviewCount,
                  rating: mechanicData.rating
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
    console.log('Selected mechanic profile:', {
      id: id,
      mechanicId: mechanic?.id,
      mechanicName: mechanic?.name,
      rating: mechanic?.rating,
      reviewCount: mechanic?.reviewCount,
      reviewsLength: mechanic?.reviews?.length,
      isNull: mechanic === null
    });
  }, [id, mechanic]);
  
  return { mechanic, id, loading, refreshData };
};
