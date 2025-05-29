
import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { DashboardTabsList } from './DashboardTabsList';
import { DashboardTabsContent } from './DashboardTabsContent';

export const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Handle hash-based tab switching (for Stripe redirects)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    setActiveTab(value);
    
    // Update hash for better navigation
    if (value !== 'overview') {
      window.history.replaceState({}, '', `#${value}`);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <DashboardTabsList />
      <DashboardTabsContent onTabChange={handleTabChange} />
    </Tabs>
  );
};
