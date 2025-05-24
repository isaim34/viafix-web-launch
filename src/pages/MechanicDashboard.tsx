
import React from 'react';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/mechanic/dashboard/DashboardHeader';
import { DashboardTabs } from '@/components/mechanic/dashboard/DashboardTabs';

const MechanicDashboard = () => {
  const { isLoggedIn, currentUserRole } = useAuth();

  // Debug logging
  React.useEffect(() => {
    console.log("MechanicDashboard component mounted", { isLoggedIn, currentUserRole });
    return () => console.log("MechanicDashboard component unmounted");
  }, [isLoggedIn, currentUserRole]);

  return (
    <AuthGuard>
      <Layout>
        <div className="container mx-auto px-4 py-6 md:py-12">
          <DashboardHeader />
          <DashboardTabs />
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default MechanicDashboard;
