
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Inbox, Settings, BarChart3, Wrench, MessageCircle } from 'lucide-react';
import GigManagement from '@/components/GigManagement';
import ProfileEditor from '@/components/ProfileEditor';
import MechanicMailbox from '@/components/MechanicMailbox';
import MechanicChat from '@/components/MechanicChat';

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
            <TabsTrigger value="gigs" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              My Gigs
            </TabsTrigger>
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gigs">
            <GigManagement />
          </TabsContent>
          
          <TabsContent value="inbox">
            <MechanicMailbox />
          </TabsContent>
          
          <TabsContent value="chat">
            <MechanicChat />
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="text-center py-20 text-muted-foreground">
              Detailed statistics coming soon
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MechanicDashboard;
