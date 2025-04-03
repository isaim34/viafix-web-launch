
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Inbox, Settings, BarChart3, Wrench, MessageCircle, CheckSquare, Star } from 'lucide-react';
import GigManagement from '@/components/GigManagement';
import ProfileEditor from '@/components/ProfileEditor';
import MechanicMailbox from '@/components/MechanicMailbox';
import MechanicChat from '@/components/MechanicChat';
import CompletedJobsTab from '@/components/CompletedJobsTab';
import StatsOverview from '@/components/stats/StatsOverview';
import AdvertisingTab from '@/components/advertising/AdvertisingTab';
import { useIsMobile } from '@/hooks/use-mobile';

const MechanicDashboard = () => {
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Mechanic Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile, gigs, and track your business
          </p>
        </motion.div>

        <Tabs defaultValue="gigs" className="w-full">
          <TabsList className="mb-6 md:mb-8 flex flex-wrap gap-1 md:gap-0">
            <TabsTrigger value="gigs" className="flex items-center gap-2 text-xs md:text-sm">
              <Wrench className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>My Gigs</span>
            </TabsTrigger>
            <TabsTrigger value="completed-jobs" className="flex items-center gap-2 text-xs md:text-sm">
              <CheckSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>Completed</span>
            </TabsTrigger>
            <TabsTrigger value="inbox" className="flex items-center gap-2 text-xs md:text-sm">
              <Inbox className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>Inbox</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 text-xs md:text-sm">
              <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="advertising" className="flex items-center gap-2 text-xs md:text-sm">
              <Star className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>Advertising</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 text-xs md:text-sm">
              <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 text-xs md:text-sm">
              <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className={isMobile ? "hidden xs:inline" : ""}>Profile</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gigs">
            <GigManagement />
          </TabsContent>
          
          <TabsContent value="completed-jobs">
            <CompletedJobsTab />
          </TabsContent>
          
          <TabsContent value="inbox">
            <MechanicMailbox />
          </TabsContent>
          
          <TabsContent value="chat">
            <MechanicChat />
          </TabsContent>
          
          <TabsContent value="advertising">
            <AdvertisingTab />
          </TabsContent>
          
          <TabsContent value="stats">
            <StatsOverview />
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
