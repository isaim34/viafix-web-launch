
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tags } from 'lucide-react';
import { SimpleSubscriptionPlans } from './SimpleSubscriptionPlans';
import { SimpleMessagePackages } from './SimpleMessagePackages';
import { SimpleFeaturedListings } from './SimpleFeaturedListings';

export const SimpleAdvertisingContent = () => {
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
            </TabsList>
            
            <TabsContent value="subscription">
              <SimpleSubscriptionPlans />
            </TabsContent>
            
            <TabsContent value="featured">
              <SimpleFeaturedListings />
            </TabsContent>
            
            <TabsContent value="messages">
              <SimpleMessagePackages />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
