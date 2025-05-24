
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Wrench } from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  customer_id: string;
  service_type: string;
  description: string;
  date: string;
  mechanic_signature: boolean;
  vehicle_id?: string;
}

interface MaintenanceRecordCardProps {
  record: MaintenanceRecord;
  formatDate: (dateString: string) => string;
}

export const MaintenanceRecordCard = ({ record, formatDate }: MaintenanceRecordCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {record.service_type}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(record.date)}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Customer ID: {record.customer_id}
              </span>
            </CardDescription>
          </div>
          {record.mechanic_signature && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Signed Off
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-sm">Service Description</h4>
            <p className="text-sm text-muted-foreground">{record.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
