
import { useState, useEffect } from 'react';
import { MechanicProfile } from '@/hooks/useMechanics';
import { calculatePerformanceScore } from '@/utils/mechanic/performanceScoring';
import { 
  fetchMechanicProfiles, 
  fetchMechanicProfile, 
  fetchJobCompletionData, 
  fetchRecentActivity 
} from '@/services/mechanic/mechanicDataService';
import { 
  MechanicPerformanceData,
  shouldExcludeMechanic,
  isMechanicFeatured,
  formatMechanicData,
  sortMechanicsByPerformance
} from '@/utils/mechanic/featuredMechanicUtils';

export const useFeaturedMechanics = (limit: number = 3) => {
  const [featuredMechanics, setFeaturedMechanics] = useState<MechanicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedMechanics = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching mechanic profiles...');
      
      const mechanicProfiles = await fetchMechanicProfiles();

      if (mechanicProfiles.length === 0) {
        setFeaturedMechanics([]);
        return;
      }

      const performanceData: MechanicPerformanceData[] = [];

      for (const mechanic of mechanicProfiles) {
        const profile = await fetchMechanicProfile(mechanic.id);
        
        // Only exclude mechanics based on real business rules, not test names
        if (shouldExcludeMechanic(profile)) {
          continue;
        }

        const isFeatured = isMechanicFeatured(mechanic);
        const { completedJobsCount, totalJobsCount } = await fetchJobCompletionData(mechanic.id);
        const recentActivityCount = await fetchRecentActivity(mechanic.id);

        // Calculate performance score
        const performanceScore = calculatePerformanceScore({
          avgRating: mechanic.rating || 0,
          totalReviews: mechanic.review_count || 0,
          completedJobs: completedJobsCount,
          totalJobs: totalJobsCount,
          recentActivity: recentActivityCount,
          yearsExperience: mechanic.years_experience || 0
        });

        const formattedMechanic = formatMechanicData(mechanic, profile, isFeatured);

        performanceData.push({
          mechanic: formattedMechanic,
          performanceScore,
          completedJobs: completedJobsCount,
          completionRate: totalJobsCount > 0 ? completedJobsCount / totalJobsCount : 0,
          avgRating: mechanic.rating || 0,
          totalReviews: mechanic.review_count || 0,
          recentActivity: recentActivityCount,
          isFeatured
        });
      }

      const sortedMechanics = sortMechanicsByPerformance(performanceData);
      const topMechanics = sortedMechanics
        .slice(0, limit)
        .map(data => data.mechanic);

      console.log('Featured mechanics ranking:', sortedMechanics.map(m => ({
        name: m.mechanic.name,
        isFeatured: m.isFeatured,
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
