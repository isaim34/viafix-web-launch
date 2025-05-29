
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MechanicProgress } from './types';
import { fetchProgressData, updateCompletionScore } from './utils/progressFetcher';

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
      setLoading(true);
      
      const newProgress = await fetchProgressData(user.id);
      
      console.log('🎯 FINAL PROGRESS STATE:', newProgress);
      setProgress(newProgress);

      // Update profile completion score
      await updateCompletionScore(user.id, newProgress);

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
