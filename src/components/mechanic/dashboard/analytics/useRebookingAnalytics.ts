
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface RebookingAnalytics {
  rebookingRate: number;
  repeatCustomers: number;
  totalCustomers: number;
}

interface FollowUpSuggestion {
  customerId: string;
  customerName: string;
  lastServiceDate: string;
  daysSince: number;
}

export const useRebookingAnalytics = () => {
  const [analytics, setAnalytics] = useState<RebookingAnalytics>({
    rebookingRate: 0,
    repeatCustomers: 0,
    totalCustomers: 0
  });
  const [followUpSuggestions, setFollowUpSuggestions] = useState<FollowUpSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;

      try {
        // Get all completed service bookings
        const { data: bookings } = await supabase
          .from('service_bookings')
          .select('customer_id, completed_at, notes')
          .eq('mechanic_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false });

        // Get all completed custom offers
        const { data: offers } = await supabase
          .from('custom_offers')
          .select('customer_id, completed_at, completion_notes')
          .eq('mechanic_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false });

        if (!bookings && !offers) {
          setLoading(false);
          return;
        }

        // Combine all completed jobs
        const allJobs = [
          ...(bookings || []).map(b => ({ customerId: b.customer_id, completedAt: b.completed_at })),
          ...(offers || []).map(o => ({ customerId: o.customer_id, completedAt: o.completed_at }))
        ];

        // Count unique customers and repeat customers
        const customerCounts = new Map<string, number>();
        const customerLastService = new Map<string, string>();

        allJobs.forEach(job => {
          const count = customerCounts.get(job.customerId) || 0;
          customerCounts.set(job.customerId, count + 1);
          
          // Track most recent service date for each customer
          const currentLast = customerLastService.get(job.customerId);
          if (!currentLast || new Date(job.completedAt) > new Date(currentLast)) {
            customerLastService.set(job.customerId, job.completedAt);
          }
        });

        const totalCustomers = customerCounts.size;
        const repeatCustomers = Array.from(customerCounts.values()).filter(count => count > 1).length;
        const rebookingRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

        // Generate follow-up suggestions (customers who haven't rebooked in 90+ days)
        const suggestions: FollowUpSuggestion[] = [];
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        for (const [customerId, lastServiceDate] of customerLastService.entries()) {
          const lastService = new Date(lastServiceDate);
          const daysSince = Math.floor((Date.now() - lastService.getTime()) / (1000 * 60 * 60 * 24));
          
          if (lastService < ninetyDaysAgo) {
            // Get customer name from profiles
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', customerId)
              .single();

            if (profile) {
              suggestions.push({
                customerId,
                customerName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
                lastServiceDate,
                daysSince
              });
            }
          }
        }

        setAnalytics({
          rebookingRate,
          repeatCustomers,
          totalCustomers
        });

        setFollowUpSuggestions(suggestions.slice(0, 3)); // Show max 3 suggestions

      } catch (error) {
        console.error('Error fetching rebooking analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.id]);

  return { analytics, followUpSuggestions, loading };
};
