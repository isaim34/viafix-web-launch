
import React, { lazy, Suspense } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ErrorBoundary from '@/ErrorBoundary';
import { OverviewTab } from './OverviewTab';
import GigManagement from '@/components/GigManagement';
import ProfileEditor from '@/components/ProfileEditor';
import MechanicChat from '@/components/MechanicChat';
import CompletedJobsTab from '@/components/CompletedJobsTab';
import WeeklyPlannerTab from '@/components/WeeklyPlannerTab';
import StatsOverview from '@/components/stats/StatsOverview';
import CancelledGigsTab from '@/components/CancelledGigsTab';
import ReviewsTab from '@/components/ReviewsTab';
import CustomOffersTab from '@/components/mechanic/CustomOffersTab';
import { DebugPanel } from '@/components/debug/DebugPanel';
import MaintenanceRecordsTab from '@/components/mechanic/MaintenanceRecordsTab';

// Lazy load the AdvertisingTab component
const AdvertisingTab = lazy(() => import('@/components/advertising/AdvertisingTab'));

const AdvertisingLoadingFallback = () => (
  <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
    <div className="flex items-center space-x-4 mb-4">
      <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-primary/20 rounded animate-pulse"></div>
        <div className="h-4 bg-primary/20 rounded animate-pulse w-5/6"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-primary/20 rounded col-span-1 animate-pulse"></div>
        <div className="h-20 bg-primary/20 rounded col-span-1 animate-pulse"></div>
        <div className="h-20 bg-primary/20 rounded col-span-1 animate-pulse"></div>
      </div>
      <div className="h-4 bg-primary/20 rounded animate-pulse w-full"></div>
      <div className="h-4 bg-primary/20 rounded animate-pulse w-4/5"></div>
    </div>
  </div>
);

export const DashboardTabsContent = () => {
  return (
    <>
      <TabsContent value="overview">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading overview</div>}>
          <OverviewTab />
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
          <Suspense fallback={<AdvertisingLoadingFallback />}>
            <AdvertisingTab />
          </Suspense>
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
      
      <TabsContent value="debug">
        <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading debug tools</div>}>
          <DebugPanel />
        </ErrorBoundary>
      </TabsContent>
    </>
  );
};
