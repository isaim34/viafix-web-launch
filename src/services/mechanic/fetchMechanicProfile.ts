
import { supabase } from '@/integrations/supabase/client';
import { MechanicDetail } from '@/types/mechanic';
import { formatMechanicProfile } from '@/utils/mechanic/formatMechanicData';
import { mechanicsDetailedData } from '@/data/mechanicsData';

/**
 * Fetch mechanic profile data from Supabase
 */
export const fetchMechanicProfile = async (id: string): Promise<MechanicDetail | null> => {
  try {
    // Fetch the mechanic profile
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
      
    if (mechanicError) {
      console.error("Error fetching mechanic profile:", mechanicError);
      throw mechanicError;
    }
    
    if (!mechanicProfile) {
      return null;
    }
    
    // Get services
    const { data: services, error: servicesError } = await supabase
      .from('mechanic_services')
      .select('id, name, price')
      .eq('mechanic_id', id);
      
    if (servicesError) {
      console.error('Error fetching services:', servicesError);
    }
    
    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('mechanic_reviews')
      .select('id, author, rating, text, created_at')
      .eq('mechanic_id', id);
      
    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
    }
    
    // Get gallery images
    const { data: gallery, error: galleryError } = await supabase
      .from('mechanic_gallery')
      .select('id, image_url')
      .eq('mechanic_id', id);
      
    if (galleryError) {
      console.error('Error fetching gallery:', galleryError);
    }
    
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
    console.error('Error in fetchMechanicProfile:', error);
    
    // Fallback to mock data if available
    if (id && mechanicsDetailedData[id]) {
      // Return fallback data without mock reviews - reviews will be loaded separately
      const fallbackData = {
        ...mechanicsDetailedData[id],
        reviews: [], // Will be populated by useMechanicData
        reviewCount: 0, // Will be updated by useMechanicData
        rating: 0 // Will be updated by useMechanicData
      };
      return fallbackData;
    }
    
    return null;
  }
};
