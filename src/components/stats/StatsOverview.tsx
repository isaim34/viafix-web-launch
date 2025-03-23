
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/mechanic/StatsCard';
import { DollarSign, Receipt, CalendarDays, Users, TrendingUp } from 'lucide-react';
import IncomeReportGenerator from './IncomeReportGenerator';

const StatsOverview: React.FC = () => {
  // In a real application, this data would come from an API call
  const statsData = {
    totalEarnings: 24850,
    jobsCompleted: 127,
    activeClients: 43,
    averageJobValue: 195.67,
    currentMonthEarnings: 3245,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <StatsCard
          title="Total Earnings"
          value={`$${statsData.totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-green-500"
        />
        <StatsCard
          title="Jobs Completed"
          value={statsData.jobsCompleted}
          icon={<Receipt className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Active Clients"
          value={statsData.activeClients}
          icon={<Users className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-purple-500"
        />
        <StatsCard
          title="Average Job Value"
          value={`$${statsData.averageJobValue.toFixed(2)}`}
          icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />}
          color="bg-orange-500"
        />
      </div>

      <IncomeReportGenerator />
    </div>
  );
};

export default StatsOverview;
