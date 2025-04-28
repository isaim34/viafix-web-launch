import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Send, CreditCard, CalendarClock, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MassMessageForm } from './MassMessageForm';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import PaymentMethodsTab from './PaymentMethodsTab';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { SubscriptionManagementSection } from './SubscriptionManagementSection';

const FEATURED_DAILY_PRICE = 24.99;
const MASS_MESSAGE_PRICE = 0.10;

const AdvertisingTab = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('subscription');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredUntil, setFeaturedUntil] = useState<string | null>(null);
  const [messagesRemaining, setMessagesRemaining] = useState(0);
  
  const subscriptionStatus = localStorage.getItem('subscription_status');
  const subscriptionPlan = localStorage.getItem('subscription_plan');
  const subscriptionEnd = localStorage.getItem('subscription_end');
  const isSubscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
  
  const handlePurchaseFeatured = (days: number) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    setIsFeatured(true);
    setFeaturedUntil(endDate.toISOString());
    
    toast({
      title: "Featured status activated!",
      description: `Your profile will be featured until ${endDate.toLocaleDateString()}`,
    });
  };
  
  const handleBuyMessages = (quantity: number) => {
    setMessagesRemaining(prev => prev + quantity);
    
    toast({
      title: "Messages purchased!",
      description: `${quantity} messages have been added to your account`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Advertising & Promotion</h2>
          <p className="text-muted-foreground">Grow your business with featured listings and direct messaging</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {isFeatured && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1 px-3 py-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              Featured until {new Date(featuredUntil!).toLocaleDateString()}
            </Badge>
          )}
          
          {isSubscribed && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-3 py-1">
              <CalendarClock className="w-3.5 h-3.5 text-green-500" />
              {subscriptionPlan?.charAt(0).toUpperCase() + subscriptionPlan?.slice(1)} Plan
              {subscriptionEnd && ` · Renews ${new Date(subscriptionEnd).toLocaleDateString()}`}
            </Badge>
          )}
        </div>
      </div>
      
      <Card className="border">
        <CardHeader className="p-0">
          <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 bg-background border-b h-auto">
            <TabsTrigger 
              value="subscription" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none border-r border-b md:border-b-0 last:border-r-0"
              onClick={() => setActiveTab('subscription')}
              data-state={activeTab === 'subscription' ? 'active' : 'inactive'}
            >
              <ShieldCheck className="h-4 w-4" />
              Subscription Plans
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none border-r border-b md:border-b-0 last:border-r-0"
              onClick={() => setActiveTab('featured')}
              data-state={activeTab === 'featured' ? 'active' : 'inactive'}
            >
              <Star className="h-4 w-4" />
              Get Featured
            </TabsTrigger>
            <TabsTrigger 
              value="messaging" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none border-r border-b md:border-b-0 last:border-r-0"
              onClick={() => setActiveTab('messaging')}
              data-state={activeTab === 'messaging' ? 'active' : 'inactive'}
            >
              <Send className="h-4 w-4" />
              Mass Messaging
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
              onClick={() => setActiveTab('payment')}
              data-state={activeTab === 'payment' ? 'active' : 'inactive'}
            >
              <CreditCard className="h-4 w-4" />
              Payment Methods
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-6">
          {activeTab === 'subscription' && (
            <>
              <SubscriptionPlansSection />
              {isSubscribed && <div className="mt-6"><SubscriptionManagementSection /></div>}
            </>
          )}
          
          {activeTab === 'featured' && (
            <FeaturedPlansSection 
              featuredDailyPrice={FEATURED_DAILY_PRICE} 
              onPurchaseFeatured={handlePurchaseFeatured} 
            />
          )}
          
          {activeTab === 'messaging' && (
            <div className="space-y-6">
              <MessagePackagesSection 
                messageCost={MASS_MESSAGE_PRICE}
                messagesRemaining={messagesRemaining}
                onBuyMessages={handleBuyMessages}
              />
              
              <MassMessageForm 
                messagesAvailable={messagesRemaining}
                messageCost={MASS_MESSAGE_PRICE}
                onSend={(messageCount) => {
                  if (messageCount <= messagesRemaining) {
                    setMessagesRemaining(prev => prev - messageCount);
                    return true;
                  }
                  return false;
                }}
              />
            </div>
          )}
          
          {activeTab === 'payment' && <PaymentMethodsTab />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingTab;
