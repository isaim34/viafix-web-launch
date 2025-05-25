
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
}

interface RecentActivityProps {
  activities: Activity[];
  onViewAllActivity: () => void;
}

export const RecentActivity = ({ activities, onViewAllActivity }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
              <div className="bg-blue-100 text-blue-700 p-1 rounded">
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={onViewAllActivity}>
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
};
