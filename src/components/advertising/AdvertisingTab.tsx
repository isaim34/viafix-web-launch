
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, CreditCard, Star, AlertCircle, Tags } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import PaymentMethodsTab from './PaymentMethodsTab';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { ErrorAlert } from './ErrorAlert';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

export default function AdvertisingTab() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, currentUserRole } = useAuth();

  useEffect(() => {
    // Simulate loading state and check authentication
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      if (!isLoggedIn) {
        setError("You must be logged in to access advertising options");
      } else if (currentUserRole !== 'mechanic') {
        setError("Advertising options are only available for mechanics");
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isLoggedIn, currentUserRole]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <ErrorAlert error={error} />
          
          {!error && (
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
                  featuredDailyPrice={9.99}
                  onPurchaseFeatured={(days) => console.log(`Purchased ${days} days of featuring`)}
                />
              </TabsContent>
              
              <TabsContent value="messages">
                <MessagePackagesSection 
                  messageCost={0.99}
                  messagesRemaining={10}
                  onBuyMessages={(quantity) => console.log(`Purchased ${quantity} messages`)}
                />
              </TabsContent>
              
              <TabsContent value="payment">
                <PaymentMethodsTab />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
