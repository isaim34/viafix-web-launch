
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Star } from 'lucide-react';

interface PerformanceSummaryProps {
  stats?: {
    completedJobs: number;
    totalEarnings: number;
    averageRating: number;
    responseRate: number;
  };
}

export const PerformanceSummary = ({ stats }: PerformanceSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Summary
        </CardTitle>
        <CardDescription>Your key metrics this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Jobs Completed</span>
            <span className="font-semibold">{stats?.completedJobs || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Average Rating</span>
            <span className="font-semibold flex items-center gap-1">
              {stats?.averageRating?.toFixed(1) || '0.0'} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Response Rate</span>
            <span className="font-semibold">{stats?.responseRate || 0}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Revenue</span>
            <span className="font-semibold text-green-600">${stats?.totalEarnings?.toLocaleString() || '0'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
