
import { supabase } from '@/integrations/supabase/client';
import { MechanicDetail } from '@/types/mechanic';
import { createLocalMechanicProfile } from '@/utils/mechanic/formatMechanicData';

/**
 * Fetch data for a local mechanic (default vendor or local mechanic account)
 */
export const fetchLocalMechanic = async (id: string): Promise<MechanicDetail | null> => {
  try {
    // Use consistent vendor name - prioritize what's set by test account generator
    const vendorName = localStorage.getItem('vendorName') || 'Mike Rodriguez';
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
    
    // Get reviews from localStorage for the special mechanic ids
    const specialReviews = JSON.parse(localStorage.getItem('special_mechanic_reviews') || '[]');
    const localReviews = specialReviews.filter((review: any) => review.mechanic_id === id);
    
    // Don't try to fetch from Supabase with string IDs that aren't UUIDs
    console.log('Skipping Supabase review fetch for local mechanic:', id);
    
    // Use only local reviews for special mechanic IDs
    const reviews = (localReviews || []).map((r: any) => ({ 
      author: r.author, 
      rating: r.rating, 
      text: r.text 
    }));
    
    return createLocalMechanicProfile(
      id,
      vendorName,
      vendorAvatar,
      mechanicProfile,
      reviews
    );
  } catch (error) {
    console.error('Error in fetchLocalMechanic:', error);
    return null;
  }
};
