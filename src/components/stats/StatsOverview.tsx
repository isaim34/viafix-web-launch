
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/mechanic/StatsCard';
import { DollarSign, Receipt, CalendarDays, Users, TrendingUp } from 'lucide-react';
import IncomeReportGenerator from './IncomeReportGenerator';
import { useMechanicDashboardData } from '@/hooks/useMechanicDashboardData';
import { Loader2 } from 'lucide-react';

const StatsOverview: React.FC = () => {
  const { stats, isLoading } = useMechanicDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading statistics...</span>
      </div>
    );
  }

  const averageJobValue = stats.completedJobs > 0 ? stats.totalEarnings / stats.completedJobs : 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <StatsCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-green-500"
        />
        <StatsCard
          title="Jobs Completed"
          value={stats.completedJobs}
          icon={<Receipt className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Ongoing Jobs"
          value={stats.ongoingJobs}
          icon={<CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-purple-500"
        />
        <StatsCard
          title="Average Job Value"
          value={`$${averageJobValue.toFixed(2)}`}
          icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-orange-500"
        />
      </div>

      <IncomeReportGenerator />
    </div>
  );
};

export default StatsOverview;
