
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MassMessageForm } from './MassMessageForm';
import { FeaturedPlanCard } from './FeaturedPlanCard';

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
        </TabsList>
        
        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeaturedPlanCard 
              title="1 Day Spotlight"
              price={FEATURED_DAILY_PRICE}
              description="Get featured in the homepage for 24 hours"
              days={1}
              onPurchase={handlePurchaseFeatured}
            />
            
            <FeaturedPlanCard 
              title="Weekly Spotlight"
              price={FEATURED_DAILY_PRICE * 7 * 0.9}
              description="Get featured in the homepage for 7 days (10% discount)"
              days={7}
              onPurchase={handlePurchaseFeatured}
              recommended
            />
            
            <FeaturedPlanCard 
              title="Monthly Spotlight"
              price={FEATURED_DAILY_PRICE * 30 * 0.8}
              description="Get featured in the homepage for 30 days (20% discount)"
              days={30}
              onPurchase={handlePurchaseFeatured}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Benefits of Being Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Star className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Prominent placement on the homepage</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Star className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Higher visibility in search results</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Star className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Featured badge on your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Star className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Up to 3x more profile views</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messaging" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleBuyMessages(50)}>
              <CardHeader>
                <CardTitle>50 Messages</CardTitle>
                <CardDescription>${(MASS_MESSAGE_PRICE * 50).toFixed(2)}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">Buy Now</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-primary shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => handleBuyMessages(200)}>
              <CardHeader>
                <CardTitle>200 Messages</CardTitle>
                <CardDescription>${(MASS_MESSAGE_PRICE * 200 * 0.9).toFixed(2)} (10% discount)</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Most Popular</Badge>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Buy Now</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleBuyMessages(500)}>
              <CardHeader>
                <CardTitle>500 Messages</CardTitle>
                <CardDescription>${(MASS_MESSAGE_PRICE * 500 * 0.8).toFixed(2)} (20% discount)</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">Buy Now</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <p>Messages available: <span className="font-medium">{messagesRemaining}</span></p>
            {messagesRemaining === 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Purchase messages to continue
              </Badge>
            )}
          </div>
          
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
      </Tabs>
    </div>
  );
};

export default AdvertisingTab;
