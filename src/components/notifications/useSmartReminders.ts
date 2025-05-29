
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SmartReminder {
  id: string;
  type: 'mechanic_inactive' | 'service_due' | 'follow_up';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
}

export const useSmartReminders = () => {
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const generateReminders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const newReminders: SmartReminder[] = [];

      try {
        // Check if user is a mechanic
        const { data: mechanicProfile } = await supabase
          .from('mechanic_profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (mechanicProfile) {
          // Mechanic reminders
          const { data: profile } = await supabase
            .from('profiles')
            .select('last_login')
            .eq('id', user.id)
            .single();

          if (profile?.last_login) {
            const lastLogin = new Date(profile.last_login);
            const daysSinceLogin = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

            if (daysSinceLogin >= 7) {
              // Get profile views from last week
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);

              const { data: profileViews } = await supabase
                .from('profile_views')
                .select('id')
                .eq('mechanic_id', user.id)
                .gte('created_at', weekAgo.toISOString());

              newReminders.push({
                id: 'mechanic_inactive',
                type: 'mechanic_inactive',
                title: 'Activity Reminder',
                message: `You had ${profileViews?.length || 0} profile views last week. Log in to improve your chances of getting booked.`,
                actionText: 'View Dashboard',
                actionUrl: '/mechanic-dashboard'
              });
            }
          }
        } else {
          // Customer reminders
          const { data: customerProfile } = await supabase
            .from('customer_profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (customerProfile) {
            // Check for recent services
            const { data: recentServices } = await supabase
              .from('maintenance_records')
              .select('date, service_type')
              .eq('customer_id', user.id)
              .order('date', { ascending: false })
              .limit(1);

            if (recentServices && recentServices.length > 0) {
              const lastService = new Date(recentServices[0].date);
              const daysSinceService = Math.floor((Date.now() - lastService.getTime()) / (1000 * 60 * 60 * 24));

              if (daysSinceService >= 30 && daysSinceService <= 60) {
                newReminders.push({
                  id: 'service_reminder',
                  type: 'service_due',
                  title: 'Service Reminder',
                  message: `Your last ${recentServices[0].service_type} was ${daysSinceService} days ago. Consider scheduling a follow-up service.`,
                  actionText: 'Browse Mechanics',
                  actionUrl: '/mechanics'
                });
              } else if (daysSinceService > 60) {
                newReminders.push({
                  id: 'overdue_service',
                  type: 'service_due',
                  title: 'Service Overdue',
                  message: `It's been ${daysSinceService} days since your last service. Check FixIQ for personalized recommendations.`,
                  actionText: 'View FixIQ',
                  actionUrl: '/customer-profile'
                });
              }
            }
          }
        }

        setReminders(newReminders);
      } catch (error) {
        console.error('Error generating smart reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    generateReminders();
  }, [user?.id]);

  const dismissReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  return { reminders, loading, dismissReminder };
};
