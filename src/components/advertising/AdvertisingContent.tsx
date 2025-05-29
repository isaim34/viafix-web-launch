
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tags } from 'lucide-react';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import PaymentMethodsTab from './PaymentMethodsTab';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { MassMessageForm } from './mass-message/MassMessageForm';
import { useMessageBalance } from '@/hooks/useMessageBalance';

export const AdvertisingContent = () => {
  const { balance, deductMessages } = useMessageBalance();
  
  // Mock pricing data - in a real app this would come from your backend/config
  const featuredDailyPrice = 9.99;
  const messageCost = 0.50;

  const handlePurchaseFeatured = (days: number) => {
    console.log(`Purchasing featured listing for ${days} days`);
  };

  const handleBuyMessages = (quantity: number) => {
    console.log(`Buying ${quantity} messages`);
  };

  const handleSendMassMessage = (messageCount: number) => {
    if (messageCount > balance.available) {
      console.error('Insufficient message balance');
      return false;
    }

    try {
      // TODO: Implement actual message sending logic via edge function
      console.log(`Sending mass message to ${messageCount} recipients`);
      
      // Deduct messages from balance
      deductMessages(messageCount);
      
      return true;
    } catch (error) {
      console.error('Error sending mass message:', error);
      return false;
    }
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
              <TabsTrigger value="mass-messages">Mass Messages</TabsTrigger>
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
                messagesRemaining={balance.available}
                onBuyMessages={handleBuyMessages}
              />
            </TabsContent>
            
            <TabsContent value="mass-messages">
              <MassMessageForm 
                messagesAvailable={balance.available}
                messageCost={messageCost}
                onSend={handleSendMassMessage}
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
