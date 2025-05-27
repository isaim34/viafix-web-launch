
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  CheckCircle
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'review' | 'message' | 'completed' | 'booking';
  message: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
  onViewAllActivity: () => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'review':
      return Star;
    case 'message':
      return MessageCircle;
    case 'completed':
      return CheckCircle;
    case 'booking':
      return Calendar;
    default:
      return Calendar;
  }
};

export const RecentActivity = ({ activities, onViewAllActivity }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="bg-blue-100 text-blue-700 p-1 rounded">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={onViewAllActivity}>
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
};
