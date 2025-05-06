
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MechanicDetail, Review } from '@/types/mechanic';
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
        
        // If this is a special mechanic (default-vendor or local-mechanic),
        // also load reviews from localStorage
        if (id === 'default-vendor' || id === 'local-mechanic') {
          const localReviews = JSON.parse(localStorage.getItem('special_mechanic_reviews') || '[]');
          const mechanicReviews = localReviews.filter((review: any) => review.mechanic_id === id);
          
          // Add local reviews to mechanic data if it exists
          if (mechanicData) {
            const reviews: Review[] = mechanicReviews.map((review: any) => ({
              author: review.author,
              rating: review.rating,
              text: review.text
            }));
            
            mechanicData.reviews = reviews;
            mechanicData.reviewCount = reviews.length;
            
            // Calculate average rating if there are reviews
            if (reviews.length > 0) {
              const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
              mechanicData.rating = totalRating / reviews.length;
            }
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
