
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import GigManagement from '@/components/GigManagement';
import ProfileEditor from '@/components/ProfileEditor';

const MechanicDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Mechanic Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile, gigs, and track your business
          </p>
        </motion.div>

        <Tabs defaultValue="gigs" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="gigs">My Gigs</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gigs">
            <GigManagement />
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="text-center py-20 text-muted-foreground">
              Statistics coming soon
            </div>
          </TabsContent>
          
          <TabsContent value="bookings">
            <div className="text-center py-20 text-muted-foreground">
              Bookings management coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MechanicDashboard;
