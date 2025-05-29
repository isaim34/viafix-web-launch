
import { useState, useEffect, useCallback } from 'react';
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

  const fetchProgress = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for progress tracking');
      setLoading(false);
      return;
    }

    try {
      console.log('=== MECHANIC PROGRESS TRACKER DEBUG ===');
      console.log('Fetching progress for user:', user.id);

      // Check profile completeness from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, zip_code, profile_image')
        .eq('id', user.id)
        .single();

      console.log('Profile query result:', { profile, profileError });

      // Check mechanic profile completeness
      const { data: mechanicProfile, error: mechanicError } = await supabase
        .from('mechanic_profiles')
        .select('about, specialties, hourly_rate, years_experience')
        .eq('id', user.id)
        .single();

      console.log('Mechanic profile query result:', { mechanicProfile, mechanicError });

      // Detailed profile completeness check
      const hasBasicProfile = profile && 
        profile.first_name && 
        profile.first_name.trim().length > 0 &&
        profile.last_name && 
        profile.last_name.trim().length > 0 &&
        profile.phone && 
        profile.phone.trim().length > 0 &&
        profile.zip_code && 
        profile.zip_code.trim().length > 0;

      const hasMechanicProfile = mechanicProfile &&
        mechanicProfile.about && 
        mechanicProfile.about.trim().length >= 20 &&
        mechanicProfile.specialties && 
        mechanicProfile.specialties.trim().length > 0 &&
        mechanicProfile.hourly_rate && 
        mechanicProfile.hourly_rate > 0 &&
        mechanicProfile.years_experience !== null &&
        mechanicProfile.years_experience >= 0;

      const profileComplete = hasBasicProfile && hasMechanicProfile;

      console.log('Profile completeness detailed check:', {
        hasBasicProfile,
        hasMechanicProfile,
        profileComplete,
        basicProfileData: {
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          phone: profile?.phone,
          zipCode: profile?.zip_code,
          profileImage: profile?.profile_image
        },
        mechanicProfileData: {
          about: mechanicProfile?.about?.substring(0, 50) + '...',
          aboutLength: mechanicProfile?.about?.length,
          specialties: mechanicProfile?.specialties,
          hourlyRate: mechanicProfile?.hourly_rate,
          yearsExperience: mechanicProfile?.years_experience
        }
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

      console.log('Verification check:', { 
        certificationsCount: certifications?.length || 0,
        galleryCount: gallery?.length || 0,
        hasVerification 
      });

      // Check for maintenance records
      const { data: maintenanceRecords } = await supabase
        .from('maintenance_records')
        .select('id')
        .eq('mechanic_id', user.id)
        .limit(1);

      const hasMaintenanceRecord = maintenanceRecords && maintenanceRecords.length > 0;

      console.log('Maintenance records check:', { 
        recordsCount: maintenanceRecords?.length || 0,
        hasMaintenanceRecord 
      });

      // Check for 5-star review
      const { data: reviews } = await supabase
        .from('mechanic_reviews')
        .select('rating')
        .eq('mechanic_id', user.id)
        .eq('rating', 5)
        .limit(1);

      const hasFiveStarReview = reviews && reviews.length > 0;

      console.log('Five star review check:', { 
        fiveStarCount: reviews?.length || 0,
        hasFiveStarReview 
      });

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

      const { error: updateError } = await supabase
        .from('mechanic_profiles')
        .update({ profile_completion_score: completionScore })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating completion score:', updateError);
      } else {
        console.log('Successfully updated completion score');
      }

      console.log('=== END MECHANIC PROGRESS TRACKER DEBUG ===');

    } catch (error) {
      console.error('Error fetching mechanic progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, refetch: fetchProgress };
};
