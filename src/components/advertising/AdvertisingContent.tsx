
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tags } from 'lucide-react';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import PaymentMethodsTab from './PaymentMethodsTab';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';

export const AdvertisingContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Tags className="text-yellow-500" />
            Advertising &amp; Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
              <TabsTrigger value="featured">Featured Listings</TabsTrigger>
              <TabsTrigger value="messages">Message Packs</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
