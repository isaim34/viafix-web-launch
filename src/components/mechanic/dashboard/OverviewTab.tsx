
import React from 'react';
import { TodaysSchedule } from './overview/TodaysSchedule';
import { RecentActivity } from './overview/RecentActivity';
import { PerformanceSummary } from './overview/PerformanceSummary';
import { QuickActions } from './overview/QuickActions';
import { getTodaysSchedule, getRecentActivity, getQuickActions } from './overview/overviewData';

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

export const OverviewTab = ({ onTabChange }: OverviewTabProps) => {
  const todaysSchedule = getTodaysSchedule();
  const recentActivity = getRecentActivity();

  // Ensure tab change handler only responds to explicit user actions
  const handleTabChange = (tabValue: string) => {
    console.log('OverviewTab: User requested tab change to:', tabValue);
    onTabChange(tabValue);
  };

  const quickActions = getQuickActions(handleTabChange);

  return (
    <div className="space-y-6">
      <TodaysSchedule 
        appointments={todaysSchedule} 
        onViewFullSchedule={() => handleTabChange('planner')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity 
          activities={recentActivity} 
          onViewAllActivity={() => handleTabChange('reviews')}
        />
        <PerformanceSummary />
      </div>

      <QuickActions actions={quickActions} />
    </div>
  );
};
