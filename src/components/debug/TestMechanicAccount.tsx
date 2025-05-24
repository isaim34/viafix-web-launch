
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const TestMechanicAccount = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const createMechanicAccount = () => {
    // Clear any existing auth data first
    localStorage.clear();
    
    // Create fake mechanic account for Austin, TX with consistent data
    const mechanicData = {
      email: 'test.mechanic@example.com',
      firstName: 'Mike',
      lastName: 'Rodriguez',
      userId: `mechanic-${Date.now()}`,
      role: 'mechanic'
    };

    // Set consistent profile image
    const profileImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';

    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userRole', mechanicData.role);
    localStorage.setItem('userEmail', mechanicData.email);
    localStorage.setItem('userName', `${mechanicData.firstName} ${mechanicData.lastName}`);
    localStorage.setItem('userId', mechanicData.userId);
    localStorage.setItem('vendorName', `${mechanicData.firstName} ${mechanicData.lastName}`);

    // Create mechanic profile data with consistent info
    const mechanicProfile = {
      firstName: mechanicData.firstName,
      lastName: mechanicData.lastName,
      specialties: 'Engine Repair, Brake Service, Oil Changes',
      hourlyRate: '85',
      yearsExperience: 8,
      about: 'Experienced mobile mechanic specializing in engine diagnostics and general automotive repair.',
      profileImage: profileImage,
      zipCode: '78730',
      location: 'Austin, TX'
    };
    
    localStorage.setItem('mechanicProfile', JSON.stringify(mechanicProfile));
    localStorage.setItem(`mechanic_profile_${mechanicData.email}`, JSON.stringify(mechanicProfile));
    
    // Store consistent vendor data
    localStorage.setItem('vendorAvatar', profileImage);
    localStorage.setItem('local-mechanic-avatar', profileImage);
    localStorage.setItem('local-mechanic-name', `${mechanicData.firstName} ${mechanicData.lastName}`);
    localStorage.setItem('mechanicAvatar', profileImage);
    
    // Store profile image with various keys for consistency
    localStorage.setItem(`mechanic-${mechanicData.userId}-profileImage`, profileImage);
    
    // Create some sample messages for testing
    const sampleMessages = [
      {
        mechanic_id: 'local-mechanic',
        author: 'John Smith',
        rating: 5,
        text: 'Great service! Mike was very professional and fixed my brake issue quickly.'
      },
      {
        mechanic_id: 'local-mechanic',
        author: 'Sarah Johnson',
        rating: 4,
        text: 'Good work on my oil change. Will definitely use again.'
      }
    ];
    
    localStorage.setItem('special_mechanic_reviews', JSON.stringify(sampleMessages));
    
    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage-event'));

    toast({
      title: "Mechanic Account Created",
      description: `Logged in as ${mechanicData.firstName} ${mechanicData.lastName} (Mechanic)`,
    });

    navigate('/mechanic-dashboard');
  };

  return (
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
  );
};
