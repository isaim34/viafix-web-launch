
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface MaintenanceRecordsHeaderProps {
  onAddRecord: () => void;
}

export const MaintenanceRecordsHeader = ({ onAddRecord }: MaintenanceRecordsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold mb-2">Maintenance Records</h2>
        <p className="text-muted-foreground">
          Track and manage service records for your customers
        </p>
      </div>
      <Button onClick={onAddRecord} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Add Record
      </Button>
    </div>
  );
};
