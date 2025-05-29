
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MechanicProfile } from '@/hooks/useMechanics';

interface MechanicPerformanceData {
  mechanic: MechanicProfile;
  performanceScore: number;
  completedJobs: number;
  completionRate: number;
  avgRating: number;
  totalReviews: number;
  recentActivity: number;
}

export const useFeaturedMechanics = (limit: number = 3) => {
  const [featuredMechanics, setFeaturedMechanics] = useState<MechanicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculatePerformanceScore = (data: {
    avgRating: number;
    totalReviews: number;
    completedJobs: number;
    totalJobs: number;
    recentActivity: number;
    yearsExperience: number;
  }): number => {
    // Scoring algorithm weights:
    // 40% Reviews & Rating (customer satisfaction)
    // 30% Job completion rate (reliability)
    // 20% Activity level (recent engagement)
    // 10% Experience and certifications

    const ratingScore = (data.avgRating / 5) * 40;
    const reviewVolumeBonus = Math.min(data.totalReviews / 10, 5); // Bonus up to 5 points for review volume
    
    const completionRate = data.totalJobs > 0 ? (data.completedJobs / data.totalJobs) : 0;
    const reliabilityScore = completionRate * 30;
    
    const activityScore = Math.min(data.recentActivity / 5, 20); // Recent jobs in last 30 days, max 20 points
    
    const experienceScore = Math.min(data.yearsExperience / 10, 10); // Max 10 points for experience
    
    return ratingScore + reviewVolumeBonus + reliabilityScore + activityScore + experienceScore;
  };

  const fetchFeaturedMechanics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get all mechanic profiles with basic info
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
          profiles:id(
            id,
            first_name,
            last_name,
            profile_image,
            zip_code
          )
        `);

      if (mechanicError) throw mechanicError;

      if (!mechanicProfiles || mechanicProfiles.length === 0) {
        setFeaturedMechanics([]);
        return;
      }

      const performanceData: MechanicPerformanceData[] = [];

      for (const mechanic of mechanicProfiles) {
        const profile = mechanic.profiles as any;
        
        // Skip Isai Mercado (the user)
        const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
        if (fullName.toLowerCase().includes('isai mercado') || 
            profile?.first_name?.toLowerCase() === 'isai' || 
            profile?.last_name?.toLowerCase() === 'mercado') {
          continue;
        }

        // Get job completion data
        const { data: completedBookings } = await supabase
          .from('service_bookings')
          .select('id')
          .eq('mechanic_id', mechanic.id)
          .eq('status', 'completed');

        const { data: totalBookings } = await supabase
          .from('service_bookings')
          .select('id')
          .eq('mechanic_id', mechanic.id);

        const { data: completedOffers } = await supabase
          .from('custom_offers')
          .select('id')
          .eq('mechanic_id', mechanic.id)
          .eq('status', 'completed');

        const { data: totalOffers } = await supabase
          .from('custom_offers')
          .select('id')
          .eq('mechanic_id', mechanic.id);

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: recentJobs } = await supabase
          .from('service_bookings')
          .select('id')
          .eq('mechanic_id', mechanic.id)
          .eq('status', 'completed')
          .gte('completed_at', thirtyDaysAgo.toISOString());

        const completedJobsCount = (completedBookings?.length || 0) + (completedOffers?.length || 0);
        const totalJobsCount = (totalBookings?.length || 0) + (totalOffers?.length || 0);
        const recentActivityCount = recentJobs?.length || 0;

        // Calculate performance score
        const performanceScore = calculatePerformanceScore({
          avgRating: mechanic.rating || 0,
          totalReviews: mechanic.review_count || 0,
          completedJobs: completedJobsCount,
          totalJobs: totalJobsCount,
          recentActivity: recentActivityCount,
          yearsExperience: mechanic.years_experience || 0
        });

        // Format mechanic data
        const formattedMechanic: MechanicProfile = {
          id: mechanic.id,
          name: fullName || 'Unknown Mechanic',
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
          response_time: mechanic.response_time || 'Under 1 hour'
        };

        performanceData.push({
          mechanic: formattedMechanic,
          performanceScore,
          completedJobs: completedJobsCount,
          completionRate: totalJobsCount > 0 ? completedJobsCount / totalJobsCount : 0,
          avgRating: mechanic.rating || 0,
          totalReviews: mechanic.review_count || 0,
          recentActivity: recentActivityCount
        });
      }

      // Sort by performance score and take top mechanics
      const topMechanics = performanceData
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, limit)
        .map(data => data.mechanic);

      console.log('Featured mechanics ranking:', performanceData.map(m => ({
        name: m.mechanic.name,
        score: m.performanceScore,
        rating: m.avgRating,
        reviews: m.totalReviews,
        completedJobs: m.completedJobs
      })));

      setFeaturedMechanics(topMechanics);
    } catch (err: any) {
      console.error('Error fetching featured mechanics:', err);
      setError(err.message);
      setFeaturedMechanics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedMechanics();
  }, [limit]);

  return { featuredMechanics, loading, error, refetch: fetchFeaturedMechanics };
};
