
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  completedJobs: number;
  cancelledJobs: number;
  ongoingJobs: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
}

interface TodayAppointment {
  id: string;
  time: string;
  customer: string;
  service: string;
  location: string;
  status: 'confirmed' | 'pending';
}

interface RecentActivity {
  id: string;
  type: 'review' | 'message' | 'completed' | 'booking';
  message: string;
  time: string;
}

export const useMechanicDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    completedJobs: 0,
    cancelledJobs: 0,
    ongoingJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    responseRate: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mechanicId = user?.id;

  useEffect(() => {
    if (mechanicId) {
      fetchDashboardData();
    }
  }, [mechanicId]);

  const fetchDashboardData = async () => {
    if (!mechanicId) return;

    setIsLoading(true);
    try {
      // Fetch stats from the view we created
      const { data: statsData } = await supabase
        .from('mechanic_stats')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .single();

      if (statsData) {
        setStats({
          completedJobs: (statsData.completed_bookings || 0) + (statsData.completed_offers || 0),
          cancelledJobs: (statsData.cancelled_bookings || 0) + (statsData.cancelled_offers || 0),
          ongoingJobs: (statsData.ongoing_bookings || 0) + (statsData.ongoing_offers || 0),
          totalEarnings: statsData.total_earnings_bookings || 0,
          averageRating: statsData.rating || 0,
          responseRate: 95 // This could be calculated from response times
        });
      }

      // Fetch today's appointments from service_bookings
      const today = new Date().toISOString().split('T')[0];
      const { data: appointmentsData } = await supabase
        .from('service_bookings')
        .select(`
          id,
          service_name,
          preferred_date,
          status,
          customer_id,
          profiles!inner(first_name, last_name)
        `)
        .eq('mechanic_id', mechanicId)
        .eq('preferred_date', today)
        .order('created_at', { ascending: true });

      if (appointmentsData) {
        const appointments: TodayAppointment[] = appointmentsData.map((booking: any, index: number) => ({
          id: booking.id,
          time: `${9 + index * 2}:00 AM`, // Generate time slots
          customer: `${booking.profiles?.first_name || 'Customer'} ${booking.profiles?.last_name || ''}`.trim(),
          service: booking.service_name,
          location: 'Customer Location', // This could be enhanced with actual addresses
          status: booking.status === 'confirmed' ? 'confirmed' : 'pending'
        }));
        setTodayAppointments(appointments);
      }

      // Fetch recent activity from various sources
      const activities: RecentActivity[] = [];

      // Recent reviews
      const { data: reviewsData } = await supabase
        .from('mechanic_reviews')
        .select('rating, author, created_at')
        .eq('mechanic_id', mechanicId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (reviewsData) {
        reviewsData.forEach(review => {
          activities.push({
            id: `review-${review.created_at}`,
            type: 'review',
            message: `New ${review.rating}-star review from ${review.author}`,
            time: formatTimeAgo(new Date(review.created_at))
          });
        });
      }

      // Recent completed jobs
      const { data: completedJobs } = await supabase
        .from('service_bookings')
        .select('service_name, completed_at, profiles!inner(first_name)')
        .eq('mechanic_id', mechanicId)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(3);

      if (completedJobs) {
        completedJobs.forEach(job => {
          activities.push({
            id: `completed-${job.completed_at}`,
            type: 'completed',
            message: `Completed ${job.service_name} for ${job.profiles?.first_name}`,
            time: formatTimeAgo(new Date(job.completed_at))
          });
        });
      }

      // Recent bookings
      const { data: recentBookings } = await supabase
        .from('service_bookings')
        .select('service_name, created_at')
        .eq('mechanic_id', mechanicId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(2);

      if (recentBookings) {
        recentBookings.forEach(booking => {
          activities.push({
            id: `booking-${booking.created_at}`,
            type: 'booking',
            message: `New booking request for ${booking.service_name}`,
            time: formatTimeAgo(new Date(booking.created_at))
          });
        });
      }

      // Sort activities by time and take the most recent
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activities.slice(0, 6));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return {
    stats,
    todayAppointments,
    recentActivity,
    isLoading,
    refreshData: fetchDashboardData
  };
};
