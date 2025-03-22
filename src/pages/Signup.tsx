
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import CustomerSignupForm from '@/components/CustomerSignupForm';
import MechanicSignupForm from '@/components/MechanicSignupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const Signup = () => {
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
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Join Mobex to find mechanics or offer your services
            </p>
          </div>

          <Tabs 
            defaultValue="customer" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="mechanic">Mechanic</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <div className="border p-6 rounded-lg shadow-sm">
                <CustomerSignupForm />
              </div>
            </TabsContent>
            <TabsContent value="mechanic">
              <div className="border p-6 rounded-lg shadow-sm">
                <MechanicSignupForm />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
