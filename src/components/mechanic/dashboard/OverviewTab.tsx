
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';
import { IncomeChart } from '@/components/stats/IncomeChart';

// Mock data - in a real app this would come from API
const getTodaysSchedule = () => [
  {
    id: 1,
    time: '9:00 AM',
    customer: 'John Smith',
    service: 'Oil Change',
    location: '123 Main St',
    status: 'confirmed'
  },
  {
    id: 2,
    time: '11:30 AM',
    customer: 'Sarah Johnson',
    service: 'Brake Inspection',
    location: '456 Oak Ave',
    status: 'pending'
  },
  {
    id: 3,
    time: '2:00 PM',
    customer: 'Mike Wilson',
    service: 'Engine Diagnostic',
    location: '789 Pine St',
    status: 'confirmed'
  }
];

const getRecentActivity = () => [
  {
    id: 1,
    type: 'review',
    message: 'New 5-star review from Emma Davis',
    time: '2 hours ago',
    icon: Star
  },
  {
    id: 2,
    type: 'message',
    message: 'Message from Alex Thompson about brake service',
    time: '4 hours ago',
    icon: MessageCircle
  },
  {
    id: 3,
    type: 'completed',
    message: 'Completed oil change for Robert Chen',
    time: '6 hours ago',
    icon: CheckCircle
  },
  {
    id: 4,
    type: 'booking',
    message: 'New booking request for transmission repair',
    time: '1 day ago',
    icon: Calendar
  }
];

const getQuickActions = () => [
  { title: 'Add New Gig', description: 'Create a new service offering', icon: '🔧' },
  { title: 'Update Schedule', description: 'Manage your availability', icon: '📅' },
  { title: 'View Messages', description: 'Check customer messages', icon: '💬' },
  { title: 'Add Maintenance Record', description: 'Log completed work', icon: '📝' },
  { title: 'Generate Report', description: 'Create income report', icon: '📊' },
  { title: 'Manage Profile', description: 'Update your information', icon: '👤' }
];

export const OverviewTab = () => {
  const todaysSchedule = getTodaysSchedule();
  const recentActivity = getRecentActivity();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>
            {todaysSchedule.length} appointments scheduled for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysSchedule.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                    {appointment.time}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.customer}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {appointment.location}
                    </p>
                  </div>
                </div>
                <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Full Schedule
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
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
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Performance Summary */}
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
                <span className="font-semibold">< 30 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Revenue</span>
                <span className="font-semibold text-green-600">$4,820</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly income trends</CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeChart />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
              >
                <span className="text-2xl">{action.icon}</span>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
