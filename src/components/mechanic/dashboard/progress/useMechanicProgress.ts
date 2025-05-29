
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
      console.log('❌ No user ID available for progress tracking');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 PROGRESS TRACKER: Starting fetch for user:', user.id);
      setLoading(true);

      // Check profile completeness from profiles table
      console.log('📋 Fetching basic profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, zip_code, profile_image')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Profile query error:', profileError);
      } else {
        console.log('✅ Profile data:', profile);
      }

      // Check mechanic profile completeness
      console.log('🔧 Fetching mechanic profile...');
      const { data: mechanicProfile, error: mechanicError } = await supabase
        .from('mechanic_profiles')
        .select('about, specialties, hourly_rate, years_experience')
        .eq('id', user.id)
        .single();

      if (mechanicError) {
        console.error('❌ Mechanic profile query error:', mechanicError);
      } else {
        console.log('✅ Mechanic profile data:', mechanicProfile);
      }

      // Detailed profile completeness check
      const basicProfileFields = {
        firstName: profile?.first_name?.trim(),
        lastName: profile?.last_name?.trim(),
        phone: profile?.phone?.trim(),
        zipCode: profile?.zip_code?.trim()
      };

      const mechanicProfileFields = {
        about: mechanicProfile?.about?.trim(),
        specialties: mechanicProfile?.specialties?.trim(),
        hourlyRate: mechanicProfile?.hourly_rate,
        yearsExperience: mechanicProfile?.years_experience
      };

      console.log('🔍 Basic profile fields:', basicProfileFields);
      console.log('🔍 Mechanic profile fields:', mechanicProfileFields);

      const hasBasicProfile = !!(
        basicProfileFields.firstName && 
        basicProfileFields.lastName && 
        basicProfileFields.phone && 
        basicProfileFields.zipCode
      );

      const hasMechanicProfile = !!(
        mechanicProfileFields.about && 
        mechanicProfileFields.about.length >= 20 &&
        mechanicProfileFields.specialties &&
        mechanicProfileFields.hourlyRate && 
        mechanicProfileFields.hourlyRate > 0 &&
        mechanicProfileFields.yearsExperience !== null &&
        mechanicProfileFields.yearsExperience >= 0
      );

      const profileComplete = hasBasicProfile && hasMechanicProfile;

      console.log('📊 Profile completeness analysis:', {
        hasBasicProfile,
        hasMechanicProfile,
        profileComplete,
        basicMissing: Object.entries(basicProfileFields).filter(([key, value]) => !value),
        mechanicMissing: Object.entries(mechanicProfileFields).filter(([key, value]) => {
          if (key === 'about') return !value || value.length < 20;
          if (key === 'hourlyRate') return !value || value <= 0;
          if (key === 'yearsExperience') return value === null || value < 0;
          return !value;
        })
      });

      // Check for verification (certifications or gallery)
      console.log('🏆 Checking verifications...');
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

      console.log('🏆 Verification status:', { 
        certificationsCount: certifications?.length || 0,
        galleryCount: gallery?.length || 0,
        hasVerification 
      });

      // Check for maintenance records
      console.log('🔧 Checking maintenance records...');
      const { data: maintenanceRecords } = await supabase
        .from('maintenance_records')
        .select('id')
        .eq('mechanic_id', user.id)
        .limit(1);

      const hasMaintenanceRecord = maintenanceRecords && maintenanceRecords.length > 0;

      console.log('🔧 Maintenance records:', { 
        recordsCount: maintenanceRecords?.length || 0,
        hasMaintenanceRecord 
      });

      // Check for 5-star review
      console.log('⭐ Checking reviews...');
      const { data: reviews } = await supabase
        .from('mechanic_reviews')
        .select('rating')
        .eq('mechanic_id', user.id)
        .eq('rating', 5)
        .limit(1);

      const hasFiveStarReview = reviews && reviews.length > 0;

      console.log('⭐ Five star review status:', { 
        fiveStarCount: reviews?.length || 0,
        hasFiveStarReview 
      });

      const newProgress = {
        profileComplete: !!profileComplete,
        hasVerification: !!hasVerification,
        hasMaintenanceRecord: !!hasMaintenanceRecord,
        hasFiveStarReview: !!hasFiveStarReview
      };

      console.log('🎯 FINAL PROGRESS STATE:', newProgress);

      setProgress(newProgress);

      // Update profile completion score
      const completionScore = [
        profileComplete,
        hasVerification,
        hasMaintenanceRecord,
        hasFiveStarReview
      ].filter(Boolean).length * 25;

      console.log('📈 Updating completion score to:', completionScore);

      const { error: updateError } = await supabase
        .from('mechanic_profiles')
        .update({ profile_completion_score: completionScore })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Error updating completion score:', updateError);
      } else {
        console.log('✅ Successfully updated completion score to:', completionScore);
      }

    } catch (error) {
      console.error('💥 Error in fetchProgress:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    console.log('🚀 Progress tracker hook mounted, fetching initial data...');
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, refetch: fetchProgress };
};
