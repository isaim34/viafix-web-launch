
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Star } from 'lucide-react';

export const PerformanceSummary = () => {
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
            <span className="font-semibold">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Average Rating</span>
            <span className="font-semibold flex items-center gap-1">
              4.9 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Response Time</span>
            <span className="font-semibold">{"< 30 min"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Revenue</span>
            <span className="font-semibold text-green-600">$4,820</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
