
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const TestAccountsGenerator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const createCustomerAccount = () => {
    // Clear any existing auth data first
    localStorage.clear();
    
    // Create fake customer account
    const customerData = {
      email: 'test.customer@example.com',
      firstName: 'John',
      lastName: 'Smith',
      userId: `customer-${Date.now()}`,
      role: 'customer'
    };

    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userRole', customerData.role);
    localStorage.setItem('userEmail', customerData.email);
    localStorage.setItem('userName', `${customerData.firstName} ${customerData.lastName}`);
    localStorage.setItem('userId', customerData.userId);

    // Create customer profile
    const profileData = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      profileImage: ''
    };
    
    localStorage.setItem('customerProfile', JSON.stringify(profileData));
    localStorage.setItem(`customer_profile_${customerData.email}`, JSON.stringify(profileData));
    
    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage-event'));

    toast({
      title: "Customer Account Created",
      description: `Logged in as ${customerData.firstName} ${customerData.lastName} (Customer)`,
    });

    navigate('/customer-profile');
  };

  const createMechanicAccount = () => {
    // Clear any existing auth data first
    localStorage.clear();
    
    // Create fake mechanic account
    const mechanicData = {
      email: 'test.mechanic@example.com',
      firstName: 'Mike',
      lastName: 'Rodriguez',
      userId: `mechanic-${Date.now()}`,
      role: 'mechanic'
    };

    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userRole', mechanicData.role);
    localStorage.setItem('userEmail', mechanicData.email);
    localStorage.setItem('userName', `${mechanicData.firstName} ${mechanicData.lastName}`);
    localStorage.setItem('userId', mechanicData.userId);
    localStorage.setItem('vendorName', `${mechanicData.firstName} ${mechanicData.lastName}`);

    // Create mechanic profile data with Austin, TX zip code
    const mechanicProfile = {
      firstName: mechanicData.firstName,
      lastName: mechanicData.lastName,
      specialties: 'Engine Repair, Brake Service, Oil Changes',
      hourlyRate: '85',
      yearsExperience: 8,
      about: 'Experienced mobile mechanic specializing in engine diagnostics and general automotive repair.',
      profileImage: '',
      zipCode: '78730' // Austin, TX zip code
    };
    
    localStorage.setItem('mechanicProfile', JSON.stringify(mechanicProfile));
    localStorage.setItem(`mechanic_profile_${mechanicData.email}`, JSON.stringify(mechanicProfile));
    
    // IMPORTANT: Also store the mechanic as vendor data so they appear in search results
    localStorage.setItem('vendorAvatar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80');
    localStorage.setItem('local-mechanic-avatar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80');
    localStorage.setItem('local-mechanic-name', `${mechanicData.firstName} ${mechanicData.lastName}`);
    
    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage-event'));

    toast({
      title: "Mechanic Account Created",
      description: `Logged in as ${mechanicData.firstName} ${mechanicData.lastName} (Mechanic)`,
    });

    navigate('/mechanic-dashboard');
  };

  const createTestVendorForSearch = () => {
    // Create a test vendor that will show up in the mechanics search without logging in
    const testVendorData = {
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      specialties: 'Engine Repair, Brake Service, Oil Changes',
      hourlyRate: 85,
      location: 'Austin, TX',
      zipCode: '78730' // Updated to Austin, TX zip code
    };

    // Store vendor data for search results
    localStorage.setItem('vendorName', testVendorData.name);
    localStorage.setItem('vendorAvatar', testVendorData.avatar);
    localStorage.setItem('local-mechanic-name', testVendorData.name);
    localStorage.setItem('local-mechanic-avatar', testVendorData.avatar);

    // Create a mechanic profile for the vendor
    const vendorProfile = {
      firstName: 'Mike',
      lastName: 'Rodriguez',
      specialties: testVendorData.specialties,
      hourlyRate: testVendorData.hourlyRate.toString(),
      yearsExperience: 8,
      about: 'Experienced mobile mechanic specializing in engine diagnostics and general automotive repair.',
      location: testVendorData.location,
      profileImage: testVendorData.avatar,
      zipCode: testVendorData.zipCode
    };

    localStorage.setItem('mechanicProfile', JSON.stringify(vendorProfile));
    localStorage.setItem('test-vendor-profile', JSON.stringify(vendorProfile));

    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage-event'));

    toast({
      title: "Test Vendor Created",
      description: `Test vendor Mike Rodriguez is now available in Austin, TX (78730) search results`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Test Customer Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Name:</strong> John Smith</p>
              <p><strong>Email:</strong> test.customer@example.com</p>
              <p><strong>Role:</strong> Customer</p>
            </div>
            <Button 
              onClick={createCustomerAccount}
              className="w-full"
              variant="outline"
            >
              <User className="h-4 w-4 mr-2" />
              Create & Login as Customer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Test Mechanic Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Name:</strong> Mike Rodriguez</p>
              <p><strong>Email:</strong> test.mechanic@example.com</p>
              <p><strong>Role:</strong> Mechanic</p>
              <p><strong>Rate:</strong> $85/hour</p>
              <p><strong>Location:</strong> Austin, TX (78730)</p>
            </div>
            <Button 
              onClick={createMechanicAccount}
              className="w-full"
              variant="outline"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Create & Login as Mechanic
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Vendor for Search</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Create a test vendor that will appear in the Austin, TX (78730) mechanics search results.
          </p>
          <Button 
            onClick={createTestVendorForSearch}
            variant="secondary"
            className="w-full"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Add Test Vendor to Austin Search Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
