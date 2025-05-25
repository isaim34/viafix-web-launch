
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const MaintenanceLogEmptyState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No maintenance records</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Start tracking your vehicle's maintenance history by adding service records.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Service Record</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaintenanceLogEmptyState;
