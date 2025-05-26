
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tags } from 'lucide-react';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import PaymentMethodsTab from './PaymentMethodsTab';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';

export const AdvertisingContent = () => {
  // Mock pricing data - in a real app this would come from your backend/config
  const featuredDailyPrice = 9.99;
  const messageCost = 0.50;
  const messagesRemaining = 25;

  const handlePurchaseFeatured = (days: number) => {
    console.log(`Purchasing featured listing for ${days} days`);
  };

  const handleBuyMessages = (quantity: number) => {
    console.log(`Buying ${quantity} messages`);
  };

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
            
            <TabsContent value="subscription">
              <SubscriptionPlansSection />
            </TabsContent>
            
            <TabsContent value="featured">
              <FeaturedPlansSection 
                featuredDailyPrice={featuredDailyPrice}
                onPurchaseFeatured={handlePurchaseFeatured}
              />
            </TabsContent>
            
            <TabsContent value="messages">
              <MessagePackagesSection 
                messageCost={messageCost}
                messagesRemaining={messagesRemaining}
                onBuyMessages={handleBuyMessages}
              />
            </TabsContent>
            
            <TabsContent value="payment">
              <PaymentMethodsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
