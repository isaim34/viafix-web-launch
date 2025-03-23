
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Send, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MassMessageForm } from './MassMessageForm';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import PaymentMethodsTab from './PaymentMethodsTab';

// Sample pricing - in a real app, this would come from an API
const FEATURED_DAILY_PRICE = 24.99;
const MASS_MESSAGE_PRICE = 0.10; // per recipient

const AdvertisingTab = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('featured');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredUntil, setFeaturedUntil] = useState<string | null>(null);
  const [messagesRemaining, setMessagesRemaining] = useState(0);
  
  const handlePurchaseFeatured = (days: number) => {
    // In a real app, this would process payment and update the backend
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
    // In a real app, this would process payment and update the backend
    setMessagesRemaining(prev => prev + quantity);
    
    toast({
      title: "Messages purchased!",
      description: `${quantity} messages have been added to your account`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Advertising & Promotion</h2>
          <p className="text-muted-foreground">Grow your business with featured listings and direct messaging</p>
        </div>
        
        {isFeatured && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1 px-3 py-1">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            Featured until {new Date(featuredUntil!).toLocaleDateString()}
          </Badge>
        )}
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Get Featured
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Mass Messaging
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Methods
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured">
          <FeaturedPlansSection 
            featuredDailyPrice={FEATURED_DAILY_PRICE} 
            onPurchaseFeatured={handlePurchaseFeatured} 
          />
        </TabsContent>
        
        <TabsContent value="messaging" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentMethodsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvertisingTab;
