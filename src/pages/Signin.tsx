
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { Separator } from '@/components/ui/separator';
import CustomerSigninForm from '@/components/CustomerSigninForm';
import MechanicSigninForm from '@/components/MechanicSigninForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Signin = () => {
  const [activeTab, setActiveTab] = useState<string>('customer');

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
            <h1 className="text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-muted-foreground">
              Welcome back to Mobex
            </p>
          </div>

          <div className="mb-8 space-y-6">
            <SocialLoginButtons />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
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
                  You are signing in as a <strong>Customer</strong>. If you're a mechanic, please switch to the mechanic tab.
                </AlertDescription>
              </Alert>
              <div className="border p-6 rounded-lg shadow-sm">
                <CustomerSigninForm />
              </div>
            </TabsContent>
            <TabsContent value="mechanic">
              <Alert className="mb-4 bg-[#F2FCE2] border-green-200">
                <AlertCircle className="h-4 w-4 text-green-800" />
                <AlertDescription className="text-green-800">
                  You are signing in as a <strong>Mechanic</strong>. If you're a customer, please switch to the customer tab.
                </AlertDescription>
              </Alert>
              <div className="border p-6 rounded-lg shadow-sm">
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
