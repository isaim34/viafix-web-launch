
import React from 'react';
import { TodaysSchedule } from './overview/TodaysSchedule';
import { RecentActivity } from './overview/RecentActivity';
import { PerformanceSummary } from './overview/PerformanceSummary';
import { QuickActions } from './overview/QuickActions';
import { getTodaysSchedule, getRecentActivity, getQuickActions } from './overview/overviewData';

interface OverviewTabProps {
  onTabChange?: (tabValue: string) => void;
}

export const OverviewTab = ({ onTabChange }: OverviewTabProps) => {
  const todaysSchedule = getTodaysSchedule();
  const recentActivity = getRecentActivity();

  // Function to handle tab changes
  const handleTabChange = (tabValue: string) => {
    console.log('Quick action clicked, switching to tab:', tabValue);
    
    if (onTabChange) {
      onTabChange(tabValue);
    } else {
      // Fallback to DOM manipulation if no callback provided
      const tabTrigger = document.querySelector(`[data-value="${tabValue}"]`) as HTMLElement;
      console.log('Tab trigger found:', tabTrigger);
      if (tabTrigger) {
        tabTrigger.click();
        console.log('Tab trigger clicked');
      } else {
        console.warn('Tab trigger not found for value:', tabValue);
        // Try alternative selector
        const altTrigger = document.querySelector(`[value="${tabValue}"]`) as HTMLElement;
        console.log('Alternative tab trigger found:', altTrigger);
        if (altTrigger) {
          altTrigger.click();
          console.log('Alternative tab trigger clicked');
        }
      }
    }
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
