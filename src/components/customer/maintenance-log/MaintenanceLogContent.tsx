
import React from 'react';
import { Card } from '@/components/ui/card';
import MaintenanceRecordTable from '../MaintenanceRecordTable';
import EmptyMaintenanceState from '../EmptyMaintenanceState';
import { MaintenanceRecord } from '@/types/customer';

interface MaintenanceLogContentProps {
  isLoading: boolean;
  records: MaintenanceRecord[];
  filteredRecords: MaintenanceRecord[];
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const MaintenanceLogContent = ({
  isLoading,
  records,
  filteredRecords,
  onEdit,
  onDelete,
  onAddClick
}: MaintenanceLogContentProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center h-40">
        <p>Loading maintenance records...</p>
      </Card>
    );
  }

  if (records.length === 0) {
    return <EmptyMaintenanceState onAddClick={onAddClick} />;
  }

  return (
    <MaintenanceRecordTable
      records={filteredRecords}
      onEdit={onEdit}
      onDeleteRecord={onDelete}
    />
  );
};
