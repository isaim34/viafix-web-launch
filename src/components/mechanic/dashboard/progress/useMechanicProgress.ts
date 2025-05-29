
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
        // Check profile completeness
        const { data: profile } = await supabase
          .from('mechanic_profiles')
          .select('about, specialties, hourly_rate, years_experience')
          .eq('id', user.id)
          .single();

        const profileComplete = profile && 
          profile.about && 
          profile.specialties && 
          profile.hourly_rate > 0 && 
          profile.years_experience > 0;

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

        // Check for maintenance records
        const { data: maintenanceRecords } = await supabase
          .from('maintenance_records')
          .select('id')
          .eq('mechanic_id', user.id)
          .limit(1);

        const hasMaintenanceRecord = maintenanceRecords && maintenanceRecords.length > 0;

        // Check for 5-star review
        const { data: reviews } = await supabase
          .from('mechanic_reviews')
          .select('rating')
          .eq('mechanic_id', user.id)
          .eq('rating', 5)
          .limit(1);

        const hasFiveStarReview = reviews && reviews.length > 0;

        setProgress({
          profileComplete: !!profileComplete,
          hasVerification: !!hasVerification,
          hasMaintenanceRecord: !!hasMaintenanceRecord,
          hasFiveStarReview: !!hasFiveStarReview
        });

        // Update profile completion score
        const completionScore = [
          profileComplete,
          hasVerification,
          hasMaintenanceRecord,
          hasFiveStarReview
        ].filter(Boolean).length * 25;

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
