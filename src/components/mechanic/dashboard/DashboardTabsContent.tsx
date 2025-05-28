import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ErrorBoundary from '@/ErrorBoundary';
import { OverviewTab } from './overview/OverviewTab';
import GigManagement from '@/components/GigManagement';
import ProfileEditor from '@/components/ProfileEditor';
import MechanicChat from '@/components/MechanicChat';
import CompletedJobsTab from '@/components/CompletedJobsTab';
import WeeklyPlannerTab from '@/components/WeeklyPlannerTab';
import StatsOverview from '@/components/stats/StatsOverview';
import CancelledGigsTab from '@/components/CancelledGigsTab';
import ReviewsTab from '@/components/ReviewsTab';
import CustomOffersTab from '@/components/mechanic/CustomOffersTab';
import MaintenanceRecordsTab from '@/components/mechanic/MaintenanceRecordsTab';
import AdvertisingTab from '@/components/advertising/AdvertisingTab';

interface DashboardTabsContentProps {
  onTabChange: (tabValue: string) => void;
}

export const DashboardTabsContent = ({ onTabChange }: DashboardTabsContentProps) => {
  return (
    <>
      <TabsContent value="overview">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading overview</div>}>
          <OverviewTab onTabChange={onTabChange} />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="gigs">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading gigs section</div>}>
          <GigManagement />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="custom-offers">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading custom offers</div>}>
          <CustomOffersTab />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="maintenance">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading maintenance records</div>}>
          <MaintenanceRecordsTab />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="completed-jobs">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading completed jobs</div>}>
          <CompletedJobsTab />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="planner">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading planner</div>}>
          <WeeklyPlannerTab />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="messages">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading messages</div>}>
          <MechanicChat />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="advertising">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading advertising options</div>}>
          <AdvertisingTab />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="stats">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading statistics</div>}>
          <StatsOverview />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="profile">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading profile</div>}>
          <ProfileEditor />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="cancelled">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading cancelled gigs</div>}>
          <CancelledGigsTab />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="reviews">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading reviews</div>}>
          <ReviewsTab />
        </ErrorBoundary>
      </TabsContent>
    </>
  );
};
