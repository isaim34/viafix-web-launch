
import React from 'react';
import { TodaysSchedule } from './TodaysSchedule';
import { RecentActivity } from './RecentActivity';
import { PerformanceSummary } from './PerformanceSummary';
import { QuickActions } from './QuickActions';
import { useMechanicDashboardData } from '@/hooks/useMechanicDashboardData';
import { getQuickActions } from './overviewData';
import { Loader2 } from 'lucide-react';

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

export const OverviewTab = ({ onTabChange }: OverviewTabProps) => {
  const { stats, todayAppointments, recentActivity, isLoading } = useMechanicDashboardData();

  const handleTabChange = (tabValue: string) => {
    console.log('OverviewTab: User requested tab change to:', tabValue);
    onTabChange(tabValue);
  };

  const quickActions = getQuickActions(handleTabChange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  // Convert data to match expected interfaces
  const formattedAppointments = todayAppointments.map((apt, index) => ({
    id: index + 1, // Convert string to number
    time: apt.time,
    customer: apt.customer,
    service: apt.service,
    location: apt.location,
    status: apt.status
  }));

  const formattedActivity = recentActivity.map((activity, index) => ({
    id: (index + 1).toString(), // Ensure string ID
    type: activity.type,
    message: activity.message,
    time: activity.time
  }));

  return (
    <div className="space-y-6">
      <TodaysSchedule 
        appointments={formattedAppointments} 
        onViewFullSchedule={() => handleTabChange('planner')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity 
          activities={formattedActivity} 
          onViewAllActivity={() => handleTabChange('reviews')}
        />
        <PerformanceSummary stats={stats} />
      </div>

      <QuickActions actions={quickActions} />
    </div>
  );
};
