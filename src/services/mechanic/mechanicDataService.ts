
import { supabase } from '@/integrations/supabase/client';

export interface MechanicProfileData {
  id: string;
  hourly_rate: number;
  years_experience: number;
  specialties: string | string[];
  rating: number;
  review_count: number;
  about: string;
  response_time: string;
  is_featured: boolean;
  featured_until: string;
}

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  zip_code: string;
}

/**
 * Fetch all mechanic profiles from the database
 */
export const fetchMechanicProfiles = async (): Promise<MechanicProfileData[]> => {
  const { data: mechanicProfiles, error: mechanicError } = await supabase
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
      featured_until
    `);

  if (mechanicError) throw mechanicError;
  return mechanicProfiles || [];
};

/**
 * Fetch profile data for a specific mechanic
 */
export const fetchMechanicProfile = async (mechanicId: string): Promise<ProfileData | null> => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, profile_image, zip_code')
    .eq('id', mechanicId)
    .maybeSingle();
  
  if (profileError) {
    console.warn(`Error fetching profile for mechanic ${mechanicId}:`, profileError);
    return null;
  }
  
  return profile;
};

/**
 * Fetch job completion data for a mechanic
 */
export const fetchJobCompletionData = async (mechanicId: string) => {
  const [
    { data: completedBookings },
    { data: totalBookings },
    { data: completedOffers },
    { data: totalOffers }
  ] = await Promise.all([
    supabase
      .from('service_bookings')
      .select('id')
      .eq('mechanic_id', mechanicId)
      .eq('status', 'completed'),
    supabase
      .from('service_bookings')
      .select('id')
      .eq('mechanic_id', mechanicId),
    supabase
      .from('custom_offers')
      .select('id')
      .eq('mechanic_id', mechanicId)
      .eq('status', 'completed'),
    supabase
      .from('custom_offers')
      .select('id')
      .eq('mechanic_id', mechanicId)
  ]);

  const completedJobsCount = (completedBookings?.length || 0) + (completedOffers?.length || 0);
  const totalJobsCount = (totalBookings?.length || 0) + (totalOffers?.length || 0);

  return { completedJobsCount, totalJobsCount };
};

/**
 * Fetch recent activity data for a mechanic (last 30 days)
 */
export const fetchRecentActivity = async (mechanicId: string): Promise<number> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentJobs } = await supabase
    .from('service_bookings')
    .select('id')
    .eq('mechanic_id', mechanicId)
    .eq('status', 'completed')
    .gte('completed_at', thirtyDaysAgo.toISOString());

  return recentJobs?.length || 0;
};
