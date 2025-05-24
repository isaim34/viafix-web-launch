
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

    // Create mechanic profile data
    const mechanicProfile = {
      firstName: mechanicData.firstName,
      lastName: mechanicData.lastName,
      specialties: 'Engine Repair, Brake Service, Oil Changes',
      hourlyRate: '85',
      yearsExperience: 8,
      about: 'Experienced mobile mechanic specializing in engine diagnostics and general automotive repair.',
      profileImage: ''
    };
    
    localStorage.setItem('mechanicProfile', JSON.stringify(mechanicProfile));
    localStorage.setItem(`mechanic_profile_${mechanicData.email}`, JSON.stringify(mechanicProfile));
    
    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage-event'));

    toast({
      title: "Mechanic Account Created",
      description: `Logged in as ${mechanicData.firstName} ${mechanicData.lastName} (Mechanic)`,
    });

    navigate('/mechanic-dashboard');
  };

  return (
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
  );
};
