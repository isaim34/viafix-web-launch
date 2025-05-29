
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerCount = () => {
  const [estimatedCount, setEstimatedCount] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(false);

  const getCustomerCount = async (targetArea: string, customZip?: string) => {
    setIsCountLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('zip_code')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const userZip = profile?.zip_code;
      let query = supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .not('zip_code', 'is', null);

      // Exclude the current user
      const currentUser = await supabase.auth.getUser();
      if (currentUser.data.user) {
        query = query.neq('id', currentUser.data.user.id);
      }

      switch (targetArea) {
        case 'localZip':
          if (userZip) {
            query = query.eq('zip_code', userZip);
          }
          break;
        case 'custom':
          if (customZip) {
            query = query.eq('zip_code', customZip);
          }
          break;
        case 'nearbyZips':
        case 'cityWide':
        case 'stateWide':
          // For now, return all customers with zip codes
          // In production, implement proper geographic filtering
          break;
      }

      const { count } = await query;
      const customerCount = count || 0;
      setEstimatedCount(customerCount);
      return customerCount;
    } catch (error) {
      console.error('Error getting customer count:', error);
      setEstimatedCount(0);
      return 0;
    } finally {
      setIsCountLoading(false);
    }
  };

  return {
    estimatedCount,
    isCountLoading,
    getCustomerCount,
    setEstimatedCount
  };
};
