
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TestVendorCreator = () => {
  const { toast } = useToast();

  const createTestVendorForSearch = () => {
    // Create a test vendor that will show up in the Austin, TX mechanics search
    const testVendorData = {
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
      specialties: 'Engine Repair, Brake Service, Oil Changes',
      hourlyRate: 85,
      location: 'Austin, TX',
      zipCode: '78730'
    };

    // Store vendor data for search results - ensure consistency
    localStorage.setItem('vendorName', testVendorData.name);
    localStorage.setItem('vendorAvatar', testVendorData.avatar);
    localStorage.setItem('local-mechanic-name', testVendorData.name);
    localStorage.setItem('local-mechanic-avatar', testVendorData.avatar);

    // Create a mechanic profile for the vendor with consistent Austin location
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

    // Create sample reviews for the vendor
    const vendorReviews = [
      {
        mechanic_id: 'default-vendor',
        author: 'Emily Davis',
        rating: 5,
        text: 'Excellent work! Very knowledgeable and professional.'
      },
      {
        mechanic_id: 'default-vendor', 
        author: 'Mark Wilson',
        rating: 4,
        text: 'Fixed my engine problem quickly. Reasonable pricing.'
      }
    ];
    
    localStorage.setItem('special_mechanic_reviews', JSON.stringify(vendorReviews));

    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage-event'));

    toast({
      title: "Test Vendor Created",
      description: `Test vendor Mike Rodriguez is now available in Austin, TX (78730) search results`,
    });
  };

  return (
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
  );
};
