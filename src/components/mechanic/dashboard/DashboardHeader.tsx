
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Plus, Calendar, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Mock data - in a real app this would come from API/state
const getQuickStats = () => ({
  todaysJobs: 3,
  weeklyRevenue: 1250,
  completionRate: 98
});

export const DashboardHeader = () => {
  const { currentUserName } = useAuth();
  const stats = getQuickStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 md:mb-8"
    >
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {getGreeting()}, {currentUserName || 'Mechanic'}!
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {getCurrentDate()}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Gig
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 rounded-full p-2">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-blue-700">Today's Jobs</p>
                <p className="text-lg md:text-2xl font-bold text-blue-900">{stats.todaysJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 rounded-full p-2">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-green-700">This Week</p>
                <p className="text-lg md:text-2xl font-bold text-green-900">${stats.weeklyRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 rounded-full p-2">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-orange-700">Completion</p>
                <p className="text-lg md:text-2xl font-bold text-orange-900">{stats.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
