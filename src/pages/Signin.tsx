
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthRedirect, UserRole } from '@/hooks/useAuthRedirect';
// Import the sign in forms directly
import CustomerSigninForm from '@/components/CustomerSigninForm';
import MechanicSigninForm from '@/components/MechanicSigninForm';

const Signin = () => {
  const [activeTab, setActiveTab] = useState<string>('customer');
  const [redirectChecked, setRedirectChecked] = useState(false);
  const { isLoggedIn, currentUserRole, authChecked } = useAuth();
  const location = useLocation();
  const { getProfileRoute } = useAuthRedirect();

  useEffect(() => {
    // Check for authentication in URL hash (from OAuth redirects)
    const checkHashParams = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token') || hash.includes('error'))) {
        console.log('OAuth redirect detected with hash params');
        // Let GoogleAuthButton component handle this
        return;
      }
    };
    
    checkHashParams();
    
    const timer = setTimeout(() => {
      setRedirectChecked(true);
    }, 500); // Increased timeout to ensure auth state is properly checked
    
    return () => clearTimeout(timer);
  }, []);

  // Add additional debug logging
  useEffect(() => {
    console.log("Signin component mounted with state:", {
      activeTab,
      redirectChecked,
      isLoggedIn,
      authChecked,
      currentUserRole,
      locationState: location.state
    });
    
    return () => console.log("Signin component unmounted");
  }, [activeTab, redirectChecked, isLoggedIn, authChecked, currentUserRole, location.state]);

  // Only redirect if we've confirmed auth state and the user is logged in
  if (redirectChecked && authChecked && isLoggedIn) {
    const redirectTo = location.state?.redirectTo || getProfileRoute(currentUserRole as UserRole);
    console.log(`User is logged in as ${currentUserRole}, redirecting to: ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to ViaFix</h1>
            <p className="text-muted-foreground">
              Sign in as a customer or mechanic
            </p>
          </div>

          <Tabs 
            defaultValue="customer" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="customer"
                className={activeTab === 'customer' ? 'bg-[#F2FCE2] !text-green-800 font-semibold' : ''}
              >
                Customer
              </TabsTrigger>
              <TabsTrigger 
                value="mechanic"
                className={activeTab === 'mechanic' ? 'bg-[#F2FCE2] !text-green-800 font-semibold' : ''}
              >
                Mechanic
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <Alert className="mb-4 bg-[#F2FCE2] border-green-200">
                <AlertCircle className="h-4 w-4 text-green-800" />
                <AlertDescription className="text-green-800">
                  {activeTab === 'customer' ? 'Find and book mechanics in your area.' : 'Offer your services to customers.'}
                </AlertDescription>
              </Alert>
              <div className="border p-6 rounded-lg shadow-sm bg-gray-50">
                <CustomerSigninForm />
              </div>
            </TabsContent>
            <TabsContent value="mechanic">
              <Alert className="mb-4 bg-[#F2FCE2] border-green-200">
                <AlertCircle className="h-4 w-4 text-green-800" />
                <AlertDescription className="text-green-800">
                  Offer your services as a mechanic to customers.
                </AlertDescription>
              </Alert>
              <div className="border p-6 rounded-lg shadow-sm bg-gray-50">
                <MechanicSigninForm />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signin;
