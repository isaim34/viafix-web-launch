
import { supabase } from '@/integrations/supabase/client';
import { MechanicDetail } from '@/types/mechanic';
import { createLocalMechanicProfile } from '@/utils/mechanic/formatMechanicData';

/**
 * Fetch data for a local mechanic (default vendor or local mechanic account)
 */
export const fetchLocalMechanic = async (id: string): Promise<MechanicDetail | null> => {
  try {
    const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
    const vendorAvatar = localStorage.getItem('vendorAvatar') || 
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
    
    // Get mechanic profile from localStorage if available
    const storedProfile = localStorage.getItem('mechanicProfile');
    let mechanicProfile: Record<string, any> = {};
    
    if (storedProfile) {
      try {
        mechanicProfile = JSON.parse(storedProfile);
      } catch (error) {
        console.error('Error parsing mechanic profile:', error);
      }
    }
    
    // Fetch real reviews for the local mechanic or default vendor
    const { data: reviews, error: reviewsError } = await supabase
      .from('mechanic_reviews')
      .select('id, author, rating, text, created_at')
      .eq('mechanic_id', id === 'local-mechanic' ? localStorage.getItem('userId') : 'default-vendor');
      
    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
    }
    
    return createLocalMechanicProfile(
      id,
      vendorName,
      vendorAvatar,
      mechanicProfile,
      reviews || []
    );
  } catch (error) {
    console.error('Error in fetchLocalMechanic:', error);
    return null;
  }
};
