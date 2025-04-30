
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, CreditCard, Star, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import { PaymentMethodsTab } from './PaymentMethodsTab';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';

export default function AdvertisingTab() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Star className="text-yellow-500" />
            Advertising &amp; Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
              <TabsTrigger value="featured">Featured Listings</TabsTrigger>
              <TabsTrigger value="messages">Message Packs</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription">
              <SubscriptionPlansSection setError={setError} />
            </TabsContent>
            
            <TabsContent value="featured">
              <FeaturedPlansSection setError={setError} />
            </TabsContent>
            
            <TabsContent value="messages">
              <MessagePackagesSection setError={setError} />
            </TabsContent>
            
            <TabsContent value="payment">
              <PaymentMethodsTab setError={setError} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
