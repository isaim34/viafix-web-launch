
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getCustomerPortal } from '@/lib/stripe';
import { toast } from '@/hooks/use-toast';
import { Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SubscriptionManagementSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { url } = await getCustomerPortal();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Failed to open subscription portal:", error);
      setError("Failed to open subscription management portal. Please try again later or contact support.");
      
      toast({
        title: "Unable to Access Portal",
        description: "We couldn't connect to the subscription management portal. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleManageSubscription}
          className="w-full sm:w-auto"
          variant="outline"
          disabled={isLoading}
        >
          <Settings className="mr-2 h-4 w-4" />
          {isLoading ? "Opening Portal..." : "Manage Subscription"}
        </Button>
      </CardContent>
    </Card>
  );
};
