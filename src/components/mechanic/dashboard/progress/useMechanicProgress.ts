
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MechanicProgress {
  profileComplete: boolean;
  hasVerification: boolean;
  hasMaintenanceRecord: boolean;
  hasFiveStarReview: boolean;
}

export const useMechanicProgress = () => {
  const [progress, setProgress] = useState<MechanicProgress>({
    profileComplete: false,
    hasVerification: false,
    hasMaintenanceRecord: false,
    hasFiveStarReview: false
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;

      try {
        console.log('Fetching progress for user:', user.id);

        // Check profile completeness from profiles table first
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, zip_code, profile_image')
          .eq('id', user.id)
          .single();

        console.log('Profile data:', profile);

        // Check mechanic profile completeness
        const { data: mechanicProfile } = await supabase
          .from('mechanic_profiles')
          .select('about, specialties, hourly_rate, years_experience')
          .eq('id', user.id)
          .single();

        console.log('Mechanic profile data:', mechanicProfile);

        // Check if profile is complete - need both basic profile and mechanic-specific data
        const profileComplete = profile && mechanicProfile &&
          profile.first_name && 
          profile.last_name && 
          profile.phone && 
          profile.zip_code &&
          mechanicProfile.about && 
          mechanicProfile.specialties && 
          mechanicProfile.hourly_rate > 0 && 
          mechanicProfile.years_experience >= 0;

        console.log('Profile complete check:', {
          hasProfile: !!profile,
          hasMechanicProfile: !!mechanicProfile,
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          phone: profile?.phone,
          zipCode: profile?.zip_code,
          about: mechanicProfile?.about,
          specialties: mechanicProfile?.specialties,
          hourlyRate: mechanicProfile?.hourly_rate,
          yearsExperience: mechanicProfile?.years_experience,
          profileComplete
        });

        // Check for verification (certifications or gallery)
        const { data: certifications } = await supabase
          .from('certifications')
          .select('id')
          .eq('profile_id', user.id)
          .limit(1);

        const { data: gallery } = await supabase
          .from('mechanic_gallery')
          .select('id')
          .eq('mechanic_id', user.id)
          .limit(1);

        const hasVerification = (certifications && certifications.length > 0) || 
                               (gallery && gallery.length > 0);

        console.log('Verification check:', { certifications, gallery, hasVerification });

        // Check for maintenance records
        const { data: maintenanceRecords } = await supabase
          .from('maintenance_records')
          .select('id')
          .eq('mechanic_id', user.id)
          .limit(1);

        const hasMaintenanceRecord = maintenanceRecords && maintenanceRecords.length > 0;

        console.log('Maintenance records check:', { maintenanceRecords, hasMaintenanceRecord });

        // Check for 5-star review
        const { data: reviews } = await supabase
          .from('mechanic_reviews')
          .select('rating')
          .eq('mechanic_id', user.id)
          .eq('rating', 5)
          .limit(1);

        const hasFiveStarReview = reviews && reviews.length > 0;

        console.log('Five star review check:', { reviews, hasFiveStarReview });

        const newProgress = {
          profileComplete: !!profileComplete,
          hasVerification: !!hasVerification,
          hasMaintenanceRecord: !!hasMaintenanceRecord,
          hasFiveStarReview: !!hasFiveStarReview
        };

        console.log('Final progress state:', newProgress);

        setProgress(newProgress);

        // Update profile completion score
        const completionScore = [
          profileComplete,
          hasVerification,
          hasMaintenanceRecord,
          hasFiveStarReview
        ].filter(Boolean).length * 25;

        console.log('Updating completion score to:', completionScore);

        await supabase
          .from('mechanic_profiles')
          .update({ profile_completion_score: completionScore })
          .eq('id', user.id);

      } catch (error) {
        console.error('Error fetching mechanic progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  return { progress, loading };
};
