import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  CheckSquare, 
  Calendar, 
  Inbox, 
  MessageCircle, 
  Tags, 
  BarChart3, 
  Settings, 
  X,
  Star,
  Database
} from 'lucide-react';
import GigManagement from '@/components/GigManagement';
import ProfileEditor from '@/components/ProfileEditor';
import MechanicMailbox from '@/components/MechanicMailbox';
import MechanicChat from '@/components/MechanicChat';
import CompletedJobsTab from '@/components/CompletedJobsTab';
import WeeklyPlannerTab from '@/components/WeeklyPlannerTab';
import StatsOverview from '@/components/stats/StatsOverview';
import CancelledGigsTab from '@/components/CancelledGigsTab';
import ReviewsTab from '@/components/ReviewsTab';
import { ClearDataButton } from '@/components/debug/ClearDataButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/ErrorBoundary';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';

// Lazy load the AdvertisingTab component
const AdvertisingTab = lazy(() => import('@/components/advertising/AdvertisingTab'));

const MechanicDashboard = () => {
  const isMobile = useIsMobile();
  const { isLoggedIn, currentUserRole } = useAuth();

  // Debug logging
  React.useEffect(() => {
    console.log("MechanicDashboard component mounted", { isLoggedIn, currentUserRole });
    return () => console.log("MechanicDashboard component unmounted");
  }, [isLoggedIn, currentUserRole]);

  // Wrap the entire dashboard in AuthGuard
  return (
    <AuthGuard>
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
            <TabsList className="mb-6 md:mb-8 flex flex-wrap gap-2 md:gap-1 justify-start">
              <div className="flex flex-wrap gap-2 md:gap-1 w-full md:w-auto">
                <TabsTrigger value="gigs" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <Wrench className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>My Gigs</span>
                </TabsTrigger>
                <TabsTrigger value="completed-jobs" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <CheckSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Completed</span>
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Cancelled</span>
                </TabsTrigger>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-1 w-full md:w-auto">
                <TabsTrigger value="planner" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Planner</span>
                </TabsTrigger>
                <TabsTrigger value="inbox" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <Inbox className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Inbox</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Chat</span>
                </TabsTrigger>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-1 w-full md:w-auto">
                <TabsTrigger value="advertising" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <Tags className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Advertising</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Statistics</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <Star className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Reviews</span>
                </TabsTrigger>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-1 w-full md:w-auto">
                <TabsTrigger value="profile" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="debug" className="flex items-center gap-2 text-xs md:text-sm min-w-[100px]">
                  <Database className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className={isMobile ? "hidden xs:inline" : ""}>Debug</span>
                </TabsTrigger>
              </div>
            </TabsList>
            
            <TabsContent value="gigs">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading gigs section</div>}>
                <GigManagement />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="completed-jobs">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading completed jobs</div>}>
                <CompletedJobsTab />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="planner">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading planner</div>}>
                <WeeklyPlannerTab />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="inbox">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading inbox</div>}>
                <MechanicMailbox />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="chat">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading chat</div>}>
                <MechanicChat />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="advertising">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading advertising options</div>}>
                <Suspense fallback={
                  <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-primary/20 rounded animate-pulse"></div>
                        <div className="h-4 bg-primary/20 rounded animate-pulse w-5/6"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-20 bg-primary/20 rounded col-span-1 animate-pulse"></div>
                        <div className="h-20 bg-primary/20 rounded col-span-1 animate-pulse"></div>
                        <div className="h-20 bg-primary/20 rounded col-span-1 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-primary/20 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-primary/20 rounded animate-pulse w-4/5"></div>
                    </div>
                  </div>
                }>
                  <AdvertisingTab />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="stats">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading statistics</div>}>
                <StatsOverview />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="profile">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading profile</div>}>
                <ProfileEditor />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="cancelled">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading cancelled gigs</div>}>
                <CancelledGigsTab />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="reviews">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading reviews</div>}>
                <ReviewsTab />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="debug">
              <ErrorBoundary fallback={<div className="p-4 text-red-600">Error loading debug tools</div>}>
                <ClearDataButton />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default MechanicDashboard;
