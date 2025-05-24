
import React from 'react';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { DashboardTabsList } from './DashboardTabsList';
import { DashboardTabsContent } from './DashboardTabsContent';

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="gigs" className="w-full">
      <DashboardTabsList />
      <DashboardTabsContent />
    </Tabs>
  );
};
