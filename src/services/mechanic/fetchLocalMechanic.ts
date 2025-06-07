
import { supabase } from '@/integrations/supabase/client';
import { MechanicDetail } from '@/types/mechanic';
import { formatMechanicProfile } from '@/utils/mechanic/formatMechanicData';

/**
 * Fetch data for a specific mechanic from Supabase
 */
export const fetchLocalMechanic = async (id: string): Promise<MechanicDetail | null> => {
  try {
    // Fetch the mechanic profile from Supabase
    const { data: mechanicProfile, error: mechanicError } = await supabase
      .from('mechanic_profiles')
      .select(`
        id,
        hourly_rate,
        years_experience,
        specialties,
        rating,
        review_count,
        about,
        response_time,
        is_featured,
        featured_until,
        profiles:id(
          id,
          first_name,
          last_name,
          profile_image,
          zip_code,
          phone
        )
      `)
      .eq('id', id)
      .single();
      
    if (mechanicError || !mechanicProfile) {
      console.error("Error fetching mechanic profile:", mechanicError);
      return null;
    }
    
    // Get services
    const { data: services } = await supabase
      .from('mechanic_services')
      .select('id, name, price')
      .eq('mechanic_id', id);
      
    // Get reviews
    const { data: reviews } = await supabase
      .from('mechanic_reviews')
      .select('id, author, rating, text, created_at')
      .eq('mechanic_id', id);
      
    // Get gallery images
    const { data: gallery } = await supabase
      .from('mechanic_gallery')
      .select('id, image_url')
      .eq('mechanic_id', id);
    
    // Format the mechanic data
    const profile = mechanicProfile.profiles as any;
    
    return formatMechanicProfile(
      mechanicProfile, 
      profile, 
      services || [], 
      reviews || [], 
      gallery || []
    );
  } catch (error) {
    console.error('Error in fetchLocalMechanic:', error);
    return null;
  }
};
