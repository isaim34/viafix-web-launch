
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyStats {
  profileViews: number;
  jobLeads: number;
  completedJobs: number;
}

export const useWeeklyStats = () => {
  const [stats, setStats] = useState<WeeklyStats>({
    profileViews: 0,
    jobLeads: 0,
    completedJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      if (!user?.id) return;

      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Get profile views from last 7 days
        const { data: profileViews } = await supabase
          .from('profile_views')
          .select('id')
          .eq('mechanic_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        // Get job leads (new bookings + custom offers) from last 7 days
        const { data: bookingLeads } = await supabase
          .from('service_bookings')
          .select('id')
          .eq('mechanic_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        const { data: offerLeads } = await supabase
          .from('custom_offers')
          .select('id')
          .eq('mechanic_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        // Get completed jobs from last 7 days
        const { data: completedBookings } = await supabase
          .from('service_bookings')
          .select('id')
          .eq('mechanic_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', sevenDaysAgo.toISOString());

        const { data: completedOffers } = await supabase
          .from('custom_offers')
          .select('id')
          .eq('mechanic_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', sevenDaysAgo.toISOString());

        setStats({
          profileViews: profileViews?.length || 0,
          jobLeads: (bookingLeads?.length || 0) + (offerLeads?.length || 0),
          completedJobs: (completedBookings?.length || 0) + (completedOffers?.length || 0)
        });

      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyStats();
  }, [user?.id]);

  return { stats, loading };
};
