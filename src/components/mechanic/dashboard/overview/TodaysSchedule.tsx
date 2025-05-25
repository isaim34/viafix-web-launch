
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

interface Appointment {
  id: number;
  time: string;
  customer: string;
  service: string;
  location: string;
  status: 'confirmed' | 'pending';
}

interface TodaysScheduleProps {
  appointments: Appointment[];
  onViewFullSchedule: () => void;
}

export const TodaysSchedule = ({ appointments, onViewFullSchedule }: TodaysScheduleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Schedule
        </CardTitle>
        <CardDescription>
          {appointments.length} appointments scheduled for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments.map((appointment) => (
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
        <Button variant="outline" className="w-full mt-4" onClick={onViewFullSchedule}>
          View Full Schedule
        </Button>
      </CardContent>
    </Card>
  );
};
