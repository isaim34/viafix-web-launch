
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MechanicDetail } from '@/types/mechanic';
import { fetchMechanicProfile } from '@/services/mechanic/fetchMechanicProfile';
import { fetchLocalMechanic } from '@/services/mechanic/fetchLocalMechanic';

/**
 * Custom hook to fetch and prepare mechanic data based on ID
 */
export const useMechanicData = (refreshTrigger = 0) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mechanic, setMechanic] = useState<MechanicDetail | null>(null);
  
  const fetchMechanicData = useCallback(async () => {
    setLoading(true);
    
    try {
      let mechanicData: MechanicDetail | null = null;
      
      // Handle special cases: default-vendor or local-mechanic
      if ((id === 'default-vendor' || id === 'local-mechanic')) {
        mechanicData = await fetchLocalMechanic(id);
      } else {
        // For other mechanics, fetch from the database
        mechanicData = await fetchMechanicProfile(id || '');
      }
      
      setMechanic(mechanicData);
    } catch (error) {
      console.error('Error fetching mechanic data:', error);
      setMechanic(null);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  // Refetch mechanic data function
  const refetchMechanic = useCallback(() => {
    fetchMechanicData();
  }, [fetchMechanicData]);
  
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
    
    fetchMechanicData();
  }, [id, navigate, fetchMechanicData, refreshTrigger]);

  // Log the selected mechanic for debugging
  useEffect(() => {
    console.log('Selected mechanic profile:', {
      id: id,
      mechanicId: mechanic?.id,
      mechanicName: mechanic?.name,
      isNull: mechanic === null
    });
  }, [id, mechanic]);
  
  return { mechanic, id, loading, refetchMechanic };
};
