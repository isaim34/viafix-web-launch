
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const TestCustomerAccount = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const createCustomerAccount = () => {
    // Clear any existing auth data first
    localStorage.clear();
    
    // Create fake customer account with consistent ID for messaging
    const customerData = {
      email: 'test.customer@example.com',
      firstName: 'John',
      lastName: 'Smith',
      userId: 'test-customer', // Standardized customer ID
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

    console.log('Created test customer account with standardized ID:', customerData.userId);

    toast({
      title: "Customer Account Created",
      description: `Logged in as ${customerData.firstName} ${customerData.lastName} (Customer)`,
    });

    navigate('/customer-profile');
  };

  return (
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
          <p><strong>User ID:</strong> test-customer</p>
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
  );
};
