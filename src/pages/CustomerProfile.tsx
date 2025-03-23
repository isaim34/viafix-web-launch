
import React, { useEffect, useState } from 'react';
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
  const [checkedAuth, setCheckedAuth] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in as a customer
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    const isCustomer = userLoggedIn && userRole === 'customer';
    
    if (!isCustomer) {
      toast({
        title: "Login Required",
        description: "You need to be logged in as a customer to view your profile",
        variant: "destructive"
      });
      navigate('/signin');
    } else {
      setCheckedAuth(true);
    }
  }, [toast, navigate]);

  // Show loading state while checking authentication
  if (!checkedAuth) {
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
