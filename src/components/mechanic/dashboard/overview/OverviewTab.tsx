
import React from 'react';
import { PerformanceSummary } from './PerformanceSummary';
import { QuickActions } from './QuickActions';
import { TodaysSchedule } from './TodaysSchedule';
import { RecentActivity } from './RecentActivity';
import { RebookingTracker } from '../analytics/RebookingTracker';
import { WeeklyStatsPanel } from '../stats/WeeklyStatsPanel';

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

export const OverviewTab = ({ onTabChange }: OverviewTabProps) => {
  // Sample data for today's schedule
  const sampleAppointments = [
    {
      id: 1,
      time: '9:00 AM',
      customer: 'John Smith',
      service: 'Oil Change',
      location: 'Downtown',
      status: 'confirmed' as const
    },
    {
      id: 2,
      time: '2:00 PM',
      customer: 'Sarah Johnson',
      service: 'Brake Inspection',
      location: 'Uptown',
      status: 'pending' as const
    }
  ];

  // Sample activity data
  const sampleActivities = [
    {
      id: '1',
      type: 'review' as const,
      message: 'New 5-star review from John Smith',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'booking' as const,
      message: 'New booking request from Sarah Johnson',
      time: '4 hours ago'
    },
    {
      id: '3',
      type: 'completed' as const,
      message: 'Completed brake service for Mike Wilson',
      time: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Weekly Stats Panel */}
      <WeeklyStatsPanel />
      
      {/* Performance and Rebooking Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceSummary />
        <RebookingTracker />
      </div>
      
      {/* Schedule and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysSchedule 
          appointments={sampleAppointments}
          onViewFullSchedule={() => onTabChange('calendar')}
        />
        <RecentActivity 
          activities={sampleActivities}
          onViewAllActivity={() => onTabChange('activity')}
        />
      </div>
      
      {/* Quick Actions */}
      <QuickActions onTabChange={onTabChange} />
    </div>
  );
};
