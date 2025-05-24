
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tags, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FeaturedPlansSection } from './FeaturedPlansSection';
import { MessagePackagesSection } from './MessagePackagesSection';
import PaymentMethodsTab from './PaymentMethodsTab';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AdvertisingTab() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  const { isLoggedIn, authChecked, currentUserRole } = useAuth();
  const navigate = useNavigate();

  // Single useEffect to handle all access checking
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      setError(null);
      
      // Wait for auth to be checked
      if (!authChecked) {
        return;
      }
      
      // Check if user is logged in
      if (!isLoggedIn) {
        setError("You must be logged in to access advertising options");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Check role from context or localStorage
      let effectiveRole = currentUserRole || localStorage.getItem('userRole');
      
      // Try to get user role from Supabase if needed
      if (!effectiveRole && isLoggedIn) {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (!userError && user) {
            effectiveRole = user.user_metadata?.role || user.user_metadata?.user_type;
            
            if (effectiveRole) {
              localStorage.setItem('userRole', effectiveRole);
              window.dispatchEvent(new Event('storage-event'));
            }
          }
        } catch (error) {
          console.error("Error fetching user from Supabase:", error);
        }
      }
      
      // Check if user is a mechanic
      if (effectiveRole !== 'mechanic') {
        setError("Advertising options are only available for mechanics");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Access granted
      setHasAccess(true);
      setError(null);
      setIsLoading(false);
    };
    
    checkAccess();
  }, [isLoggedIn, authChecked, currentUserRole]);

  const handleRefresh = () => {
    setError(null);
    setIsLoading(true);
    window.dispatchEvent(new Event('storage-event'));
  };

  const handleQuickFix = () => {
    localStorage.setItem('userRole', 'mechanic');
    localStorage.setItem('pendingAuthRole', 'mechanic');
    localStorage.setItem('selectedRole', 'mechanic');
    
    supabase.auth.updateUser({
      data: {
        user_type: 'mechanic',
        role: 'mechanic'
      }
    }).then(({data, error}) => {
      if (error) {
        console.error("Error updating user metadata:", error);
      }
    });
    
    window.dispatchEvent(new Event('storage-event'));
    
    setError(null);
    setIsLoading(true);
    
    toast({
      title: "Role Updated",
      description: "Your user role has been set to 'mechanic' for testing purposes.",
    });
  };

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

  if (error || !hasAccess) {
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
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error accessing advertising options</AlertTitle>
              <AlertDescription className="flex flex-col gap-4">
                <p>{error}</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-fit" 
                    onClick={() => navigate('/signin?role=mechanic')}
                  >
                    Sign In as Mechanic
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Detection
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleQuickFix}
                  >
                    Quick Fix (Set as Mechanic)
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
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
        </CardContent>
      </Card>
    </div>
  );
}
