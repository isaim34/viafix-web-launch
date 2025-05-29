
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/mechanic/dashboard/DashboardHeader';
import { DashboardTabs } from '@/components/mechanic/dashboard/DashboardTabs';

const MechanicDashboard = () => {
  const { isLoggedIn, currentUserRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Handle success/cancel redirects from Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const plan = searchParams.get('plan');
    const quantity = searchParams.get('quantity');

    if (success === 'subscription') {
      toast({
        title: "Subscription Successful!",
        description: `Your ${plan} subscription has been activated successfully.`,
        variant: "default"
      });
      
      // Switch to advertising tab and clean up URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('plan');
      newUrl.hash = '#advertising';
      window.history.replaceState({}, '', newUrl.toString());
    } else if (success === 'featured') {
      toast({
        title: "Featured Plan Purchased!",
        description: `Your ${quantity} day featured listing has been activated.`,
        variant: "default"
      });
      
      // Switch to advertising tab and clean up URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('quantity');
      newUrl.hash = '#advertising';
      window.history.replaceState({}, '', newUrl.toString());
    } else if (canceled === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again anytime.",
        variant: "destructive"
      });
      
      // Clean up URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('canceled');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, toast]);

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
