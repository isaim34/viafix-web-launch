
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const MaintenanceRecordsEmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-20">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-muted-foreground">No maintenance records yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first maintenance record to start tracking your work
        </p>
      </CardContent>
    </Card>
  );
};
