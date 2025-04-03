
import React from 'react';
import { Wrench } from 'lucide-react';

const EmptyMaintenanceState = () => {
  return (
    <div className="text-center py-8 text-muted-foreground border rounded-md">
      <Wrench className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
      <h3 className="text-lg font-medium mb-2">No maintenance records</h3>
      <p>Start tracking your vehicle maintenance by adding a record.</p>
    </div>
  );
};

export default EmptyMaintenanceState;
