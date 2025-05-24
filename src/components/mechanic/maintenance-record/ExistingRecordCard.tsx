
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface ExistingRecordCardProps {
  existingRecord: any;
}

export const ExistingRecordCard = ({ existingRecord }: ExistingRecordCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Existing Maintenance Record Found
        </CardTitle>
        <CardDescription>
          The customer already has a maintenance record. Your work will be added to it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {new Date(existingRecord.date).toLocaleDateString()}
            </Badge>
            <span className="text-sm font-medium">{existingRecord.service_type}</span>
          </div>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
            {existingRecord.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
