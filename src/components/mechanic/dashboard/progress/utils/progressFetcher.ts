
import { supabase } from '@/integrations/supabase/client';
import { MechanicProgress, BasicProfileFields, MechanicProfileFields } from '../types';
import { checkBasicProfileCompleteness, checkMechanicProfileCompleteness, analyzeMissingFields } from './profileUtils';

export const fetchProgressData = async (userId: string): Promise<MechanicProgress> => {
  console.log('🔍 PROGRESS TRACKER: Starting fetch for user:', userId);

  // Check profile completeness from profiles table
  console.log('📋 Fetching basic profile...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, phone, zip_code, profile_image')
    .eq('id', userId)
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
    .eq('id', userId)
    .single();

  if (mechanicError) {
    console.error('❌ Mechanic profile query error:', mechanicError);
  } else {
    console.log('✅ Mechanic profile data:', mechanicProfile);
  }

  // Detailed profile completeness check
  const basicProfileFields: BasicProfileFields = {
    firstName: profile?.first_name?.trim(),
    lastName: profile?.last_name?.trim(),
    phone: profile?.phone?.trim(),
    zipCode: profile?.zip_code?.trim()
  };

  const mechanicProfileFields: MechanicProfileFields = {
    about: mechanicProfile?.about?.trim(),
    specialties: mechanicProfile?.specialties?.trim(),
    hourlyRate: mechanicProfile?.hourly_rate,
    yearsExperience: mechanicProfile?.years_experience
  };

  console.log('🔍 Basic profile fields:', basicProfileFields);
  console.log('🔍 Mechanic profile fields:', mechanicProfileFields);

  const hasBasicProfile = checkBasicProfileCompleteness(basicProfileFields);
  const hasMechanicProfile = checkMechanicProfileCompleteness(mechanicProfileFields);
  const profileComplete = hasBasicProfile && hasMechanicProfile;

  const { basicMissing, mechanicMissing } = analyzeMissingFields(basicProfileFields, mechanicProfileFields);

  console.log('📊 Profile completeness analysis:', {
    hasBasicProfile,
    hasMechanicProfile,
    profileComplete,
    basicMissing,
    mechanicMissing
  });

  // Check for verification (certifications or gallery)
  console.log('🏆 Checking verifications...');
  const { data: certifications } = await supabase
    .from('certifications')
    .select('id')
    .eq('profile_id', userId)
    .limit(1);

  const { data: gallery } = await supabase
    .from('mechanic_gallery')
    .select('id')
    .eq('mechanic_id', userId)
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
    .eq('mechanic_id', userId)
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
    .eq('mechanic_id', userId)
    .eq('rating', 5)
    .limit(1);

  const hasFiveStarReview = reviews && reviews.length > 0;

  console.log('⭐ Five star review status:', { 
    fiveStarCount: reviews?.length || 0,
    hasFiveStarReview 
  });

  return {
    profileComplete: !!profileComplete,
    hasVerification: !!hasVerification,
    hasMaintenanceRecord: !!hasMaintenanceRecord,
    hasFiveStarReview: !!hasFiveStarReview
  };
};

export const updateCompletionScore = async (userId: string, progress: MechanicProgress): Promise<void> => {
  const completionScore = [
    progress.profileComplete,
    progress.hasVerification,
    progress.hasMaintenanceRecord,
    progress.hasFiveStarReview
  ].filter(Boolean).length * 25;

  console.log('📈 Updating completion score to:', completionScore);

  const { error: updateError } = await supabase
    .from('mechanic_profiles')
    .update({ profile_completion_score: completionScore })
    .eq('id', userId);

  if (updateError) {
    console.error('❌ Error updating completion score:', updateError);
  } else {
    console.log('✅ Successfully updated completion score to:', completionScore);
  }
};
