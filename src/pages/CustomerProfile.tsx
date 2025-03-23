
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Card } from '@/components/ui/card';
import CustomerProfileEditor from '@/components/customer/CustomerProfileEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VehicleMaintenanceLog from '@/components/customer/VehicleMaintenanceLog';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
  const { isCustomerLoggedIn } = useCustomerAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check login status inside useEffect to avoid state updates during render
    if (!isCustomerLoggedIn) {
      toast({
        title: "Login Required",
        description: "You need to be logged in as a customer to view your profile",
        variant: "destructive"
      });
      navigate('/signin');
    }
  }, [isCustomerLoggedIn, toast, navigate]);

  // If not logged in, render nothing while the useEffect handles the redirect
  if (!isCustomerLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="maintenance">Vehicle Maintenance Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="p-6">
              <CustomerProfileEditor />
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <Card className="p-6">
              <VehicleMaintenanceLog />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerProfile;
