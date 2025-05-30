
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export const CustomerPortalButton = () => {
  const handleOpenPortal = () => {
    // Replace with your actual Stripe Customer Portal link
    const portalUrl = 'https://billing.stripe.com/p/login/test_customer_portal';
    window.open(portalUrl, '_blank');
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleOpenPortal}
      className="flex items-center gap-2"
    >
      <ExternalLink className="h-4 w-4" />
      Manage Subscriptions
    </Button>
  );
};
