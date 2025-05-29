
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Briefcase, CheckCircle, TrendingUp } from 'lucide-react';
import { useWeeklyStats } from './useWeeklyStats';

export const WeeklyStatsPanel = () => {
  const { stats, loading } = useWeeklyStats();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  }

  const statItems = [
    {
      title: 'Profile Views',
      value: stats.profileViews,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Job Leads',
      value: stats.jobLeads,
      icon: Briefcase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Last 7 Days Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`text-center p-3 rounded-lg ${item.bgColor}`}>
                <Icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                <div className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-xs text-gray-600">
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 rounded-full p-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-1">Pro Tip</h4>
              <p className="text-sm text-purple-700">
                Mechanics with active FixIQ logs are rebooked 3 times more often than those without.
                Keep logging maintenance to boost your visibility!
              </p>
            </div>
          </div>
        </div>

        {stats.profileViews > 0 && stats.completedJobs === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Notice:</strong> You had {stats.profileViews} profile views this week but no completed jobs. 
              Consider updating your pricing or response time to convert more leads!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
