
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Card } from '@/components/ui/card';
import CustomerProfileEditor from '@/components/customer/CustomerProfileEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VehicleMaintenanceLog from '@/components/customer/VehicleMaintenanceLog';
import VehicleIntelligenceSystem from '@/components/fixiq/VehicleIntelligenceSystem';
import VINLookupTool from '@/components/customer/VINLookupTool';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { Car, User, Shield } from 'lucide-react';

const CustomerProfile = () => {
  const { isCustomerLoggedIn } = useCustomerAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkedAuth, setCheckedAuth] = useState(false);
  
  useEffect(() => {
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

  if (!checkedAuth) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile Information</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center justify-center gap-2">
              <Car className="h-4 w-4" />
              <span>Vehicle Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="fixiq" className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              <span>FixIQ Safety</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="p-8">
              <CustomerProfileEditor />
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <Card className="p-8">
              <VehicleMaintenanceLog />
            </Card>
          </TabsContent>
          
          <TabsContent value="fixiq">
            <Card className="p-8">
              <VINLookupTool />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerProfile;
