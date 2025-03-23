
import React from 'react';
import { Layout } from '@/components/Layout';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Card } from '@/components/ui/card';
import CustomerProfileEditor from '@/components/customer/CustomerProfileEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VehicleMaintenanceLog from '@/components/customer/VehicleMaintenanceLog';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const CustomerProfile = () => {
  const { isCustomerLoggedIn } = useCustomerAuth();

  // Redirect to login if not logged in as a customer
  if (!isCustomerLoggedIn) {
    toast({
      title: "Login Required",
      description: "You need to be logged in as a customer to view your profile",
      variant: "destructive"
    });
    return <Navigate to="/signin" />;
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
