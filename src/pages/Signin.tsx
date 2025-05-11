
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import type { UserRole } from '@/contexts/auth/types';
// Import the sign in forms directly without lazy loading
import CustomerSigninForm from '@/components/CustomerSigninForm';
import MechanicSigninForm from '@/components/MechanicSigninForm';

const Signin = () => {
  const [activeTab, setActiveTab] = useState<string>('customer');
  const { isLoggedIn, currentUserRole, authChecked } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { getProfileRoute } = useAuthRedirect();

  // Try to restore the active tab from localStorage or URL on first render
  useEffect(() => {
    try {
      const storedSelectedRole = localStorage.getItem('selectedRole');
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      
      // Priority: URL param > localStorage > default (customer)
      let initialRole = 'customer';
      
      if (roleParam === 'mechanic' || roleParam === 'customer') {
        initialRole = roleParam;
      } else if (storedSelectedRole === 'mechanic' || storedSelectedRole === 'customer') {
        initialRole = storedSelectedRole;
      }
      
      setActiveTab(initialRole);
      console.log(`Initial role tab set to: ${initialRole} (from URL: ${roleParam}, from storage: ${storedSelectedRole})`);
      
      // Store pending role for Google Auth
      localStorage.setItem('pendingAuthRole', initialRole);
    } catch (error) {
      console.error("Error in tab initialization:", error);
      // Fallback to customer if there's an error
      setActiveTab('customer');
    }
  }, []);

  // Set user role in localStorage when tab changes to ensure consistency
  useEffect(() => {
    if (activeTab) {
      try {
        localStorage.setItem('selectedRole', activeTab);
        localStorage.setItem('pendingAuthRole', activeTab);
        
        // Also update URL to reflect selected role without causing navigation
        const url = new URL(window.location.href);
        url.searchParams.set('role', activeTab);
        window.history.replaceState({}, '', url.toString());
        
        console.log(`Selected role tab changed to: ${activeTab}`);
      } catch (error) {
        console.error("Error updating role in storage:", error);
      }
    }
  }, [activeTab]);

  // Add additional debug logging
  useEffect(() => {
    console.log("Signin component authentication state:", {
      isLoggedIn,
      authChecked,
      currentUserRole,
      activeTab,
      locationState: location.state
    });
  }, [isLoggedIn, authChecked, currentUserRole, activeTab, location.state]);

  // Redirect if already logged in
  if (authChecked && isLoggedIn && currentUserRole) {
    console.log(`User is logged in as ${currentUserRole}, redirecting to profile`);
    const redirectTo = location.state?.redirectTo || getProfileRoute(currentUserRole as UserRole);
    return <Navigate to={redirectTo} replace />;
  }

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Checking authentication status...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Render the main sign-in content
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
              Quick Sign In for Testing (No Password Required)
            </p>
          </div>

          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              // Update pending role in localStorage for Google auth
              localStorage.setItem('pendingAuthRole', value);
              // Store selected role in localStorage for better persistence
              localStorage.setItem('selectedRole', value);
            }}
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
                  Find and book mechanics in your area.
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
