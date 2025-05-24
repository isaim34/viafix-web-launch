
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import VehicleMaintenanceForm from '../VehicleMaintenanceForm';
import { MaintenanceRecord } from '@/types/customer';

interface MaintenanceLogActionsProps {
  onSaveRecord: (record: MaintenanceRecord) => Promise<void>;
  editingRecord: MaintenanceRecord | null;
  setEditingRecord: (record: MaintenanceRecord | null) => void;
}

export const MaintenanceLogActions = ({ 
  onSaveRecord, 
  editingRecord, 
  setEditingRecord 
}: MaintenanceLogActionsProps) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vehicle Maintenance Records</h2>
        <Button 
          onClick={() => {
            setIsAdding(true);
            setEditingRecord(null);
          }}
          disabled={isAdding || !!editingRecord}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Record
        </Button>
      </div>
      
      {isAdding && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Maintenance Record</h3>
          <VehicleMaintenanceForm
            onSave={onSaveRecord}
            onCancel={() => setIsAdding(false)}
          />
        </Card>
      )}
      
      {editingRecord && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Edit Maintenance Record</h3>
          <VehicleMaintenanceForm
            initialData={editingRecord}
            onSave={onSaveRecord}
            onCancel={() => setEditingRecord(null)}
          />
        </Card>
      )}
    </>
  );
};
