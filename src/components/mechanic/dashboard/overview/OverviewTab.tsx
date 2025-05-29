
import React from 'react';
import { PerformanceSummary } from './PerformanceSummary';
import { QuickActions } from './QuickActions';
import { TodaysSchedule } from './TodaysSchedule';
import { RecentActivity } from './RecentActivity';
import { MechanicProgressTracker } from '../progress/MechanicProgressTracker';
import { RebookingTracker } from '../analytics/RebookingTracker';
import { WeeklyStatsPanel } from '../stats/WeeklyStatsPanel';

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

export const OverviewTab = ({ onTabChange }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Progress and Weekly Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MechanicProgressTracker />
        <WeeklyStatsPanel />
      </div>
      
      {/* Performance and Rebooking Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceSummary />
        <RebookingTracker />
      </div>
      
      {/* Schedule and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysSchedule />
        <RecentActivity />
      </div>
      
      {/* Quick Actions */}
      <QuickActions onTabChange={onTabChange} />
    </div>
  );
};
