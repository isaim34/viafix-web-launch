
import React from 'react';
import { PerformanceSummary } from './PerformanceSummary';
import { TodaysSchedule } from './TodaysSchedule';
import { RecentActivity } from './RecentActivity';
import { RebookingTracker } from '../analytics/RebookingTracker';
import { WeeklyStatsPanel } from '../stats/WeeklyStatsPanel';
import { useMechanicDashboardData } from '@/hooks/useMechanicDashboardData';

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

export const OverviewTab = ({ onTabChange }: OverviewTabProps) => {
  const { stats, todayAppointments, recentActivity, isLoading } = useMechanicDashboardData();

  return (
    <div className="space-y-6">
      {/* Weekly Stats Panel */}
      <WeeklyStatsPanel />
      
      {/* Performance and Rebooking Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceSummary stats={stats} />
        <RebookingTracker />
      </div>
      
      {/* Schedule and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysSchedule 
          appointments={todayAppointments}
          onViewFullSchedule={() => onTabChange('calendar')}
        />
        <RecentActivity 
          activities={recentActivity}
          onViewAllActivity={() => onTabChange('activity')}
        />
      </div>
    </div>
  );
};
