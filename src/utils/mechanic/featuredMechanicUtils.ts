
import { MechanicProfile } from '@/hooks/useMechanics';
import { MechanicProfileData, ProfileData } from '@/services/mechanic/mechanicDataService';

export interface MechanicPerformanceData {
  mechanic: MechanicProfile;
  performanceScore: number;
  completedJobs: number;
  completionRate: number;
  avgRating: number;
  totalReviews: number;
  recentActivity: number;
  isFeatured: boolean;
}

/**
 * Check if a mechanic should be excluded from results
 */
export const shouldExcludeMechanic = (profile: ProfileData | null): boolean => {
  if (!profile) return true;
  
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  return fullName.toLowerCase().includes('isai mercado') || 
         profile.first_name?.toLowerCase() === 'isai' || 
         profile.last_name?.toLowerCase() === 'mercado';
};

/**
 * Check if a mechanic is currently featured (paid)
 */
export const isMechanicFeatured = (mechanic: MechanicProfileData): boolean => {
  return mechanic.is_featured && 
         mechanic.featured_until && 
         new Date(mechanic.featured_until) > new Date();
};

/**
 * Format mechanic data into MechanicProfile
 */
export const formatMechanicData = (
  mechanic: MechanicProfileData,
  profile: ProfileData | null,
  isFeatured: boolean
): MechanicProfile => {
  const fullName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : 'Unknown Mechanic';

  return {
    id: mechanic.id,
    name: fullName,
    avatar: profile?.profile_image || '',
    specialties: typeof mechanic.specialties === 'string' 
      ? mechanic.specialties.split(',').map(s => s.trim())
      : Array.isArray(mechanic.specialties) 
        ? mechanic.specialties 
        : ['General Repairs'],
    rating: mechanic.rating || 0,
    reviewCount: mechanic.review_count || 0,
    location: 'Austin, TX', // Default location
    hourlyRate: mechanic.hourly_rate || 0,
    zipCode: profile?.zip_code || '',
    about: mechanic.about || '',
    years_experience: mechanic.years_experience || 0,
    response_time: mechanic.response_time || 'Under 1 hour',
    featured: isFeatured,
    featuredUntil: isFeatured ? mechanic.featured_until : undefined
  };
};

/**
 * Sort mechanics by featured status and performance score
 */
export const sortMechanicsByPerformance = (mechanics: MechanicPerformanceData[]): MechanicPerformanceData[] => {
  return mechanics.sort((a, b) => {
    // Featured mechanics come first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    
    // If both are featured or both are not featured, sort by performance score
    return b.performanceScore - a.performanceScore;
  });
};
