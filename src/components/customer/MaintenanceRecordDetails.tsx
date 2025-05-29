
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Wrench } from 'lucide-react';
import { MaintenanceRecord } from '@/types/customer';
import { RebookMechanicButton } from '../common/RebookMechanicButton';

interface MaintenanceRecordDetailsProps {
  record: MaintenanceRecord;
}

const MaintenanceRecordDetails = ({ record }: MaintenanceRecordDetailsProps) => {
  const isRecentService = () => {
    const recordDate = new Date(record.date);
    const daysSince = Math.floor((Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince <= 30;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {record.serviceType}
          </CardTitle>
          <Badge variant={isRecentService() ? "default" : "secondary"}>
            {new Date(record.date).toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Service Date:</span>
              <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Performed by:</span>
              <span className="font-medium">{record.mechanic}</span>
            </div>
            
            {record.vin && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{record.vehicle}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {record.mechanicSignature && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                Mechanic Verified
              </Badge>
            )}
          </div>
        </div>
        
        {record.description && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Service Details:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {record.description}
            </p>
          </div>
        )}
        
        {record.mechanic !== 'Self-Recorded' && record.mechanic !== 'Self-recorded' && (
          <div className="pt-3 border-t">
            <RebookMechanicButton
              mechanicId="default-mechanic" // This would need to be the actual mechanic ID
              mechanicName={record.mechanic}
              lastServiceType={record.serviceType}
              lastServiceDate={record.date}
              className="w-full sm:w-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceRecordDetails;
