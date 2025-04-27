
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getCustomerPortal } from '@/lib/stripe';
import { toast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

export const SubscriptionManagementSection = () => {
  const handleManageSubscription = async () => {
    try {
      const { url } = await getCustomerPortal();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription management portal. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your subscription plan, payment methods, and billing details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleManageSubscription}
          className="w-full sm:w-auto"
          variant="outline"
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage Subscription
        </Button>
      </CardContent>
    </Card>
  );
};
