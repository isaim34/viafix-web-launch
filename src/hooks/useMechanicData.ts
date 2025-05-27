
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MechanicDetail } from '@/types/mechanic';
import { fetchMechanicProfile } from '@/services/mechanic/fetchMechanicProfile';
import { fetchLocalMechanic } from '@/services/mechanic/fetchLocalMechanic';

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
        
        // For mechanics with valid UUID IDs, fetch reviews from Supabase
        // For special IDs like 'default-vendor', reviews are already handled in fetchLocalMechanic
        if (mechanicData && id && isValidUUID(id)) {
          try {
            const { data: reviews } = await import('@/integrations/supabase/client').then(module => 
              module.supabase
                .from('mechanic_reviews')
                .select('id, author, rating, text, created_at')
                .eq('mechanic_id', id)
            );
            
            if (reviews) {
              mechanicData.reviews = reviews.map(review => ({
                author: review.author,
                rating: review.rating,
                text: review.text || ''
              }));
              mechanicData.reviewCount = reviews.length;
              
              // Calculate average rating if there are reviews
              if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                mechanicData.rating = totalRating / reviews.length;
              }
            }
          } catch (error) {
            console.error('Error fetching reviews:', error);
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
      isNull: mechanic === null
    });
  }, [id, mechanic]);
  
  return { mechanic, id, loading, refreshData };
};
