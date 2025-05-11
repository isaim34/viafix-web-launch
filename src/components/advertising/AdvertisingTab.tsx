
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
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AdvertisingTab() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, authChecked, currentUserRole } = useAuth();
  const navigate = useNavigate();
  
  // Add failsafe role detection from localStorage
  const [localRole, setLocalRole] = useState<string | null>(null);

  useEffect(() => {
    // Log authentication state for debugging
    console.log("AdvertisingTab auth state:", { isLoggedIn, authChecked, currentUserRole });
    
    // Try to get role from localStorage as fallback
    const storedRole = localStorage.getItem('userRole');
    setLocalRole(storedRole);
    
    // Decide whether to load section or show error
    const checkAccess = () => {
      setIsLoading(true);
      
      if (!authChecked) {
        console.log("Auth check still in progress...");
        return; // Wait for auth check to complete
      }
      
      if (!isLoggedIn) {
        console.log("User is not logged in");
        setError("You must be logged in to access advertising options");
        setIsLoading(false);
        return;
      }
      
      // Check role from context or localStorage
      const effectiveRole = currentUserRole || storedRole;
      console.log("Effective role:", effectiveRole);
      
      if (!effectiveRole) {
        console.log("No role detected");
        setError("Unable to determine your user role. Please try signing out and signing in again.");
        setIsLoading(false);
        return;
      }
      
      if (effectiveRole !== 'mechanic') {
        console.log(`User role (${effectiveRole}) is not mechanic`);
        setError("Advertising options are only available for mechanics");
        setIsLoading(false);
        return;
      }
      
      console.log("Access granted to advertising tab");
      setError(null);
      setIsLoading(false);
    };
    
    // Check access with a slight delay to ensure auth state is loaded
    const timer = setTimeout(checkAccess, 300);
    return () => clearTimeout(timer);
  }, [isLoggedIn, authChecked, currentUserRole]);

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

  // Handle auth error with retry option
  if (error) {
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
                <p className="text-sm text-gray-700">
                  Debug info: Role={currentUserRole || localRole || 'unknown'}, 
                  Auth={isLoggedIn ? 'logged-in' : 'logged-out'}, 
                  Checked={authChecked ? 'yes' : 'no'}
                </p>
                <div className="flex gap-3 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-fit" 
                    onClick={() => navigate('/signin')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
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
