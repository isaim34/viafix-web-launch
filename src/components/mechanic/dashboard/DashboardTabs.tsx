
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { DashboardTabsList } from './DashboardTabsList';
import { DashboardTabsContent } from './DashboardTabsContent';

export const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabValue: string) => {
    console.log('DashboardTabs: Changing tab to:', tabValue);
    setActiveTab(tabValue);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <DashboardTabsList />
      <DashboardTabsContent onTabChange={handleTabChange} />
    </Tabs>
  );
};
